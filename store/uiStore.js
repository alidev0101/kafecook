import { create } from "zustand";

export const useUIStore = create((set) => ({
  cartOpen: false,
  searchOpen: false,
  mobileMenuOpen: false,
  notificationsOpen: false,

  setCartOpen: (open) => set({ cartOpen: open }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setNotificationsOpen: (open) => set({ notificationsOpen: open }),

  closeAll: () =>
    set({
      cartOpen: false,
      searchOpen: false,
      mobileMenuOpen: false,
      notificationsOpen: false,
    }),
}));
