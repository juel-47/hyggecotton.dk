//new update to working code : 
// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import axios from "axios";
// import debounce from "lodash/debounce";
// import { route } from "ziggy-js";

// export const useCartStore = create(
//     persist(
//         (set, get) => ({
//             /* =====================
//          STATE
//       ====================== */
//             cartItems: [],
//             total: 0,
//             cartCount: 0,

//             /* =====================
//          HELPERS
//       ====================== */
//             //calculate total & all count
//             // recalculate: (items) => {
//             //   const total = items.reduce((sum, i) => {
//             //     // variant_total + extra_price
//             //     const basePrice = parseFloat(i.price || 0);
//             //     const variantTotal = parseFloat(i.options?.variant_total || 0);
//             //     const extraPrice = parseFloat(i.options?.extra_price || 0);

//             //     const itemTotalPrice = basePrice + variantTotal + extraPrice;
//             //     return sum + itemTotalPrice * i.quantity;
//             //   }, 0);

//             //   const count = items.reduce((sum, i) => sum + i.quantity, 0);

//             //   return {
//             //     cartItems: items,
//             //     total: total.toFixed(2),
//             //     cartCount: count,
//             //   };
//             // },

//             // unique count
//             // recalculate: (items) => {
//             //   const total = items.reduce((sum, i) => {
//             //     const basePrice = parseFloat(i.price || 0);
//             //     const variantTotal = parseFloat(i.options?.variant_total || 0);
//             //     const extraPrice = parseFloat(i.options?.extra_price || 0);

//             //     const itemTotalPrice = basePrice + variantTotal + extraPrice;
//             //     return sum + itemTotalPrice * i.quantity;
//             //   }, 0);

//             //   const count = items.length;

//             //   return {
//             //     cartItems: items,
//             //     total: total.toFixed(2),
//             //     cartCount: count,
//             //   };
//             // },
//             // Fixed recalculate: ensures quantity is number, and cartCount is unique items count
//             recalculate: (items) => {
//                 const total = items.reduce((sum, i) => {
//                     const quantity = Number(i.quantity) || 1; // Force number
//                     const basePrice = parseFloat(i.price || 0);
//                     const variantTotal = parseFloat(
//                         i.options?.variant_total || 0
//                     );
//                     const extraPrice = parseFloat(i.options?.extra_price || 0);

//                     const itemTotalPrice =
//                         basePrice + variantTotal + extraPrice;
//                     return sum + itemTotalPrice * quantity;
//                 }, 0);

//                 const count = items.length; // unique items count

//                 return {
//                     cartItems: items,
//                     total: Number(total.toFixed(2)),
//                     cartCount: count,
//                 };
//             },
//             /* =====================
//          SET CART (FROM SERVER)
//       ====================== */
//             setCart: (items) => {
//                 const state = get().recalculate(items);
//                 set(state);
//             },

//             /* =====================
//          INCREMENT
//       ====================== */
//             increment: (cartId, availableStock) => {
//                 set((state) => {
//                     const items = state.cartItems.map((item) => {
//                         if (item.id === cartId) {
//                             const qty = item.quantity + 1;
//                             if (qty > availableStock) return item;
//                             return { ...item, quantity: qty };
//                         }
//                         return item;
//                     });

//                     return get().recalculate(items);
//                 });

//                 debouncedSync();
//             },

//             /* =====================
//          DECREMENT
//       ====================== */
//             decrement: (cartId) => {
//                 set((state) => {
//                     const items = state.cartItems
//                         .map((item) =>
//                             item.id === cartId && item.quantity > 1
//                                 ? { ...item, quantity: item.quantity - 1 }
//                                 : item
//                         )
//                         .filter((item) => item.quantity >= 1);

//                     return get().recalculate(items);
//                 });

//                 debouncedSync();
//             },

//             /* =====================
//          REMOVE ITEM
//       ====================== */
//             remove: (cartId) => {
//                 set((state) => {
//                     const items = state.cartItems.filter(
//                         (item) => item.id !== cartId
//                     );
//                     return get().recalculate(items);
//                 });

//                 axios.delete(route("cart.remove", cartId));
//             },

//             // remove: async (cartId) => {
//             //   set((state) => {
//             //     const items = state.cartItems.filter((item) => item.id !== cartId);
//             //     return get().recalculate(items);
//             //   });

//             //   try {
//             //     await axios.delete(`/cart/remove/${cartId}`, {
//             //       headers: {
//             //         'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
//             //         'X-Requested-With': 'XMLHttpRequest',
//             //       },
//             //     });
//             //   } catch (error) {
//             //     console.error('Remove failed', error);
//             //     // ঐচ্ছিক: error হলে আবার cart reload করতে পারো
//             //     // get().loadCart(); // যদি loadCart function থাকে
//             //   }
//             // },

//             /* =====================
//          CLEAR CART
//       ====================== */
//             clearCart: () => {
//                 set({
//                     cartItems: [],
//                     total: 0,
//                     cartCount: 0,
//                 });

//                 axios.post(route("cart.clear"));
//             },

//             /* =====================
//          SYNC WITH BACKEND
//       ====================== */
//             syncCart: async () => {
//                 try {
//                     await axios.post(route("cart.sync"), {
//                         items: get().cartItems.map((i) => ({
//                             id: i.id,
//                             quantity: i.quantity,
//                         })),
//                     });
//                 } catch (e) {
//                     console.error("Cart sync failed", e);
//                 }
//             },
//         }),
//         {
//             name: "cart-storage",
//             partialize: (state) => ({
//                 cartItems: state.cartItems,
//                 total: state.total,
//                 cartCount: state.cartCount,
//             }),
//         }
//     )
// );

// /* =====================
//    DEBOUNCED SYNC
// ====================== */
// const debouncedSync = debounce(() => {
//     useCartStore.getState().syncCart();
// }, 700);


//--- IGNORE number fix increment ---

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { route } from 'ziggy-js';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      total: 0,
      cartCount: 0,

      // Fixed recalculate: ensures quantity is number, and cartCount is unique items count
      recalculate: (items) => {
        const total = items.reduce((sum, i) => {
          const quantity = Number(i.quantity) || 1; // Force number
          const basePrice = parseFloat(i.price || 0);
          const variantTotal = parseFloat(i.options?.variant_total || 0);
          const extraPrice = parseFloat(i.options?.extra_price || 0);

          const itemTotalPrice = basePrice + variantTotal + extraPrice;
          return sum + itemTotalPrice * quantity;
        }, 0);

        const count = items.length; // unique items count

        return {
          cartItems: items,
          total: Number(total.toFixed(2)),
          cartCount: count,
        };
      },

      setCart: (items) => {
        // Normalize quantities to numbers when setting from server
        const normalizedItems = items.map(item => ({
          ...item,
          quantity: Number(item.quantity) || 1,
        }));
        const state = get().recalculate(normalizedItems);
        set(state);
      },

      increment: (cartId, availableStock) => {
        set((state) => {
          const items = state.cartItems.map((item) => {
            if (item.id === cartId) {
              const currentQty = Number(item.quantity) || 1;
              const newQty = currentQty + 1;
              if (newQty > availableStock) return item;
              return { ...item, quantity: newQty };
            }
            return item;
          });

          return get().recalculate(items);
        });

        debouncedSync(); // This will be properly debounced
      },

      decrement: (cartId) => {
        set((state) => {
          const items = state.cartItems
            .map((item) => {
              if (item.id === cartId) {
                const currentQty = Number(item.quantity) || 1;
                if (currentQty <= 1) return null; // will be filtered
                return { ...item, quantity: currentQty - 1 };
              }
              return item;
            })
            .filter(Boolean); // remove nulls

          return get().recalculate(items);
        });

        debouncedSync();
      },

      remove: (cartId) => {
        set((state) => {
          const items = state.cartItems.filter((item) => item.id !== cartId);
          return get().recalculate(items);
        });

        // Fire and forget delete
        axios.delete(route('cart.remove', cartId)).catch(console.error);
      },

      clearCart: () => {
        set({
          cartItems: [],
          total: 0,
          cartCount: 0,
        });

        axios.post(route('cart.clear')).catch(console.error);
      },

      syncCart: async () => {
        const items = get().cartItems;

        // Prevent sending empty or invalid data
        if (items.length === 0) return;

        try {
          await axios.post(route('cart.sync'), {
            items: items.map((i) => ({
              id: i.id,
              quantity: Number(i.quantity), // Always send as number
            })),
          });
        } catch (e) {
          console.error('Cart sync failed', e);
          // Optional: you could reload cart from server on failure
        }
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        cartItems: state.cartItems.map(item => ({
          ...item,
          quantity: Number(item.quantity), // Ensure saved as number
        })),
        total: state.total,
        cartCount: state.cartCount,
      }),
      // Important: customize how state is restored
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Normalize quantities when rehydrating from localStorage
          state.cartItems = state.cartItems.map(item => ({
            ...item,
            quantity: Number(item.quantity) || 1,
          }));
          // Recalculate after rehydration
          const recalculated = get().recalculate(state.cartItems);
          set(recalculated);
        }
      },
    }
  )
);

// Cancel any pending sync on page unload to avoid race
window.addEventListener('beforeunload', () => {
  debouncedSync.cancel();
});

const debouncedSync = debounce(() => {
  useCartStore.getState().syncCart();
}, 700);

// Optional: cancel on route change if using router
// If you're using Inertia.js or similar, cancel on navigation

export default useCartStore;


