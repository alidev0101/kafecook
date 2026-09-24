import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

let syncTimeout = null;

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      discountAmount: 0,
      loading: false,

      getItemsCount: () =>
        get().items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),

      getSubtotal: () =>
        get().items.reduce(
          (sum, item) =>
            sum + Number(item.price || 0) * Number(item.quantity || 0),
          0
        ),

      getTotal: () =>
        Math.max(
          0,
          get().getSubtotal() - Number(get().discountAmount || 0)
        ),

      addItem(item) {
        set((state) => {
          const variantId = item.variantId || null;
          const index = state.items.findIndex(
            (i) =>
              i.productId === item.productId &&
              i.variantId === variantId
          );

          if (index !== -1) {
            const items = [...state.items];

            items[index] = {
              ...items[index],
              quantity:
                Number(items[index].quantity) + Number(item.quantity || 1),
            };

            return { items };
          }

          return {
            items: [
              ...state.items,
              {
                id: `${item.productId}-${variantId || "default"}-${Date.now()}`,
                productId: item.productId,
                variantId,
                quantity: Number(item.quantity || 1),
                price: Number(item.price || 0),
                comparePrice: item.comparePrice
                  ? Number(item.comparePrice)
                  : null,
                productSnapshot: item.productSnapshot || {},
              },
            ],
          };
        });

        get()._debouncedSync();
      },

      removeItem(id) {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));

        get()._debouncedSync();
      },

      updateQuantity(id, quantity) {
        quantity = Number(quantity);

        if (quantity < 1) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));

        get()._debouncedSync();
      },

      clearCart() {
        set({
          items: [],
          coupon: null,
          discountAmount: 0,
        });

        axios.delete("/api/cart").catch(() => { });
      },

      applyCoupon(coupon, discountAmount) {
        set({
          coupon,
          discountAmount: Number(discountAmount || 0),
        });
      },

      removeCoupon() {
        set({
          coupon: null,
          discountAmount: 0,
        });
      },

      async fetchCart() {
        set({ loading: true });

        try {
          const { data } = await axios.get("/api/cart");

          const cart = data?.data || data?.cart || data;

          if (cart) {
            get().setFromServer(cart);
          } else {
            set({
              items: [],
              coupon: null,
              discountAmount: 0,
            });
          }

          return cart;
        } catch (err) {
          if (err?.response?.status !== 401) {
            console.warn("Fetch cart failed:", err);
          }

          return null;
        } finally {
          set({ loading: false });
        }
      },

      async syncWithServer() {
        const items = get().items;

        try {
          await axios.post("/api/cart/sync", {
            items: items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              price: item.price,
              quantity: item.quantity,
            })),
          });

          // await get().fetchCart();
        } catch (err) {
          if (err?.response?.status !== 401) {
            console.warn(
              "Cart sync failed:",
              err?.response?.data?.message
            );
          }
        }
      },

      _debouncedSync() {
        if (syncTimeout) clearTimeout(syncTimeout);

        syncTimeout = setTimeout(() => {
          get().syncWithServer();
        }, 800);
      },

      setFromServer(serverCart) {
        set({
          items: (serverCart?.items || []).map((item) => ({
            id:
              item._id?.toString() ||
              `${item.product}-${item.variantId || "default"}-${Date.now()}`,

            productId:
              typeof item.product === "string"
                ? item.product
                : item.product?._id?.toString(),

            variantId: item.variantId?.toString() || null,

            quantity: Number(item.quantity || 1),

            price: Number(item.price || 0),

            comparePrice: item.comparePrice
              ? Number(item.comparePrice)
              : null,

            productSnapshot: item.productSnapshot || {},
          })),

          discountAmount: Number(serverCart?.discountAmount || 0),

          coupon: serverCart?.coupon || null,
        });
      },
    }),
    {
      name: "kafe-cart",
      version: 3,

      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
        discountAmount: state.discountAmount,
      }),
    }
  )
);