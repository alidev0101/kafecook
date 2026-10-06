import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      productIds: [],
      loading: false,

      getItemsCount() {
        return get().productIds.length;
      },

      isWishlisted(productId) {
        if (!productId) return false;

        return get().productIds.includes(productId?.toString());
      },

      async toggle(productId) {
        if (!productId) return;

        const id = productId.toString();
        const exists = get().productIds.includes(id);

        // Optimistic update
        set((state) => ({
          productIds: exists
            ? state.productIds.filter((item) => item !== id)
            : [...state.productIds, id],
        }));

        try {
          await axios.post("/api/wishlist", {
            productId: id,
          });
        } catch (error) {
          // Revert on error
          set((state) => ({
            productIds: exists
              ? [...state.productIds, id]
              : state.productIds.filter((item) => item !== id),
          }));

          if (error?.response?.status !== 401) {
            console.warn("Wishlist sync failed:", error);
          }
        }
      },

      async fetchWishlist() {
        set({ loading: true });

        try {
          const { data } = await axios.get("/api/wishlist");

          const wishlist = data?.data || data?.wishlist || data;

          if (Array.isArray(wishlist)) {
            get().setFromServer(wishlist);
          } else if (wishlist?.items) {
            get().setFromServer(wishlist.items);
          } else if (wishlist?.products) {
            get().setFromServer(wishlist.products);
          } else {
            set({ productIds: [] });
          }

          return wishlist;
        } catch (error) {
          if (error?.response?.status !== 401) {
            console.warn("Fetch wishlist failed:", error);
          }

          return null;
        } finally {
          set({ loading: false });
        }
      },

      setFromServer(products) {
        const ids = (products || [])
          .map((item) => {
            const product = item?.product ?? item;

            return typeof product === "string"
              ? product
              : product?._id?.toString();
          })
          .filter(Boolean);

        set({
          productIds: [...new Set(ids)],
        });
      },

      clearWishlist() {
        set({
          productIds: [],
        });
      },

      get count() {
        return get().productIds.length;
      },
    }),
    {
      name: "kafe-wishlist",
      version: 2,

      partialize: (state) => ({
        productIds: state.productIds,
      }),
    }
  )
);