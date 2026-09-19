import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

// Helper: آیا کاربر لاگین است؟ (از session cookie بررسی نمی‌کنیم — فقط
//  هنگام syncWithServer اگر 401 برگشت، silent fail می‌کنیم)
let syncTimeout = null;

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      discountAmount: 0,
      loading: false,

      // ─── Computed (getter-style) ──────────────────────────────────────
      get itemsCount() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
      get subtotal() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },
      get total() {
        return Math.max(0, get().subtotal - get().discountAmount);
      },

      // ─── Actions ─────────────────────────────────────────────────────
      addItem(item) {
        set((state) => {
          const existing = state.items.findIndex(
            (i) =>
              i.productId === item.productId &&
              i.variantId === (item.variantId || null)
          );
          if (existing > -1) {
            const items = [...state.items];
            items[existing] = {
              ...items[existing],
              quantity: items[existing].quantity + (item.quantity || 1),
            };
            return { items };
          }
          return {
            items: [
              ...state.items,
              {
                id: `${item.productId}-${item.variantId || "default"}-${Date.now()}`,
                productId: item.productId,
                variantId: item.variantId || null,
                quantity: item.quantity || 1,
                price: item.price,
                comparePrice: item.comparePrice || null,
                productSnapshot: item.productSnapshot || {},
              },
            ],
          };
        });
        // sync با سرور با debounce (جلوگیری از چندین call پشت سرهم)
        get()._debouncedSync();
      },

      removeItem(id) {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
        get()._debouncedSync();
      },

      updateQuantity(id, quantity) {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }));
        get()._debouncedSync();
      },

      clearCart() {
        set({ items: [], coupon: null, discountAmount: 0 });
        // حذف cart در سرور هم
        axios.delete("/api/cart").catch(() => {});
      },

      applyCoupon(coupon, discountAmount) {
        set({ coupon, discountAmount });
      },

      removeCoupon() {
        set({ coupon: null, discountAmount: 0 });
      },

      // ─── Server Sync ─────────────────────────────────────────────────
      // ارسال کل cart به سرور یکجا (bulk sync)
      async syncWithServer() {
        const items = get().items;
        if (!items.length) return;

        try {
          // ابتدا cart فعلی را clear کنیم، بعد همه را add کنیم
          // از endpoint POST /api/cart/sync استفاده می‌کنیم
          await axios.post("/api/cart/sync", {
            items: items.map((i) => ({
              productId: i.productId,
              variantId: i.variantId || null,
              quantity: i.quantity,
              price: i.price,
              comparePrice: i.comparePrice,
              productSnapshot: i.productSnapshot,
            })),
          });
        } catch (err) {
          // 401: کاربر لاگین نیست — نادیده بگیر (guest cart در localStorage می‌ماند)
          if (err?.response?.status !== 401) {
            console.warn("Cart sync failed:", err?.response?.data?.message);
          }
        }
      },

      // debounced version برای جلوگیری از over-sync
      _debouncedSync() {
        if (syncTimeout) clearTimeout(syncTimeout);
        syncTimeout = setTimeout(() => {
          get().syncWithServer();
        }, 800);
      },

      // بارگذاری cart از سرور به store (بعد از login)
      setFromServer(serverCart) {
        if (!serverCart?.items?.length) return;
        set({
          items: serverCart.items.map((item) => ({
            id: item._id?.toString() || `${item.product}-${Date.now()}`,
            productId:
              typeof item.product === "string"
                ? item.product
                : item.product?._id?.toString(),
            variantId: item.variantId?.toString() || null,
            quantity: item.quantity,
            price: item.price,
            comparePrice: item.comparePrice || null,
            productSnapshot: item.productSnapshot || {},
          })),
          discountAmount: serverCart.discountAmount || 0,
          coupon: serverCart.coupon || null,
        });
      },
    }),
    {
      name: "kafe-cart",
      version: 2,
      // فقط این فیلدها persist شوند
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
        discountAmount: state.discountAmount,
      }),
    }
  )
);
