import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import debounce from "lodash/debounce";
import { route } from "ziggy-js";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      total: 0,
      cartCount: 0,

      /* =========================
         Recalculate helper
      ========================= */
      recalculate: (items) => {
        const total = items.reduce((sum, i) => {
          const qty = Number(i.quantity) || 1;
          const base = Number(i.price || 0);
          const variant = Number(i.options?.variant_total || 0);
          const extra = Number(i.options?.extra_price || 0);
          return sum + (base + variant + extra) * qty;
        }, 0);

        return {
          cartItems: items,
          total: Number(total.toFixed(2)),
          cartCount: items.length,
        };
      },

      /* =========================
         Replace cart from server
      ========================= */
      setCart: (items) => {
        const normalized = items.map((i) => ({
          ...i,
          quantity: Number(i.quantity) || 1,
        }));
        set(get().recalculate(normalized));
      },

      /* =========================
         Increment (Optimistic + Reconcile)
      ========================= */
      increment: async (cartId, stock = 999) => {
        const item = get().cartItems.find((i) => i.id === cartId);
        if (!item) return;
        if (item.quantity >= stock) return;

        // optimistic UI
        set((state) =>
          get().recalculate(
            state.cartItems.map((i) =>
              i.id === cartId ? { ...i, quantity: i.quantity + 1 } : i
            )
          )
        );

        try {
          const res = await axios.post(route("cart.update"), {
            cart_id: cartId,
            quantity: item.quantity + 1,
          });

          // ⭐ replace with server cart (promotion safe)
          if (res.data?.cart_items) {
            get().setCart(res.data.cart_items);
          }
        } catch (e) {
          console.error(e);
        }
      },

      /* =========================
         Decrement
      ========================= */
      decrement: async (cartId) => {
        const item = get().cartItems.find((i) => i.id === cartId);
        if (!item || item.quantity <= 1) return;

        set((state) =>
          get().recalculate(
            state.cartItems.map((i) =>
              i.id === cartId ? { ...i, quantity: i.quantity - 1 } : i
            )
          )
        );

        try {
          const res = await axios.post(route("cart.update"), {
            cart_id: cartId,
            quantity: item.quantity - 1,
          });

          if (res.data?.cart_items) {
            get().setCart(res.data.cart_items);
          }
        } catch (e) {
          console.error(e);
        }
      },

      /* =========================
         Remove
      ========================= */
      remove: async (cartId) => {
        set((state) =>
          get().recalculate(state.cartItems.filter((i) => i.id !== cartId))
        );

        try {
          const res = await axios.delete(route("cart.remove", cartId));

          if (res.data?.cart_items) {
            get().setCart(res.data.cart_items);
          }
        } catch (e) {
          console.error(e);
        }
      },

      /* =========================
         Sync (fallback / debounce)
      ========================= */
      syncCart: async () => {
        try {
          const res = await axios.post(route("cart.sync"), {
            items: get().cartItems.map((i) => ({
              id: i.id,
              quantity: Number(i.quantity),
            })),
          });

          if (res.data?.cart_items) {
            get().setCart(res.data.cart_items);
          }
        } catch (e) {
          console.error("Sync failed", e);
        }
      },
    }),
    {
      name: "cart-storage",
    }
  )
);

// optional debounce sync
const debouncedSync = debounce(() => {
  useCartStore.getState().syncCart();
}, 700);
