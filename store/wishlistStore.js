import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      productIds: [], // local wishlist IDs
      loading: false,

      isWishlisted(productId) {
        return get().productIds.includes(productId);
      },

      toggle(productId) {
        const exists = get().productIds.includes(productId);
        if (exists) {
          set((state) => ({
            productIds: state.productIds.filter((id) => id !== productId),
          }));
        } else {
          set((state) => ({
            productIds: [...state.productIds, productId],
          }));
        }
        // Sync with server
        axios
          .post("/api/wishlist", { productId })
          .catch(() => {
            // Revert on error
            if (exists) {
              set((state) => ({
                productIds: [...state.productIds, productId],
              }));
            } else {
              set((state) => ({
                productIds: state.productIds.filter((id) => id !== productId),
              }));
            }
          });
      },

      setFromServer(products) {
        const ids = products.map((p) =>
          typeof p.product === "string" ? p.product : p.product?._id
        );
        set({ productIds: ids });
      },

      get count() {
        return get().productIds.length;
      },
    }),
    {
      name: "kafe-wishlist",
      version: 1,
    }
  )
);
