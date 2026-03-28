// import { create } from 'zustand';

// import { persist } from 'zustand/middleware';
// import axios from 'axios';
// import debounce from 'lodash/debounce';
// import { route } from 'ziggy-js';

// export const useCartStore = create(
//   persist(
//     (set, get) => ({
//       cartItems: [],
//       total: 0,
//       cartCount: 0,

//       recalculate: (items) => {
//         const total = items.reduce((sum, item) => {
//           const qty = Number(item.quantity) || 1;
//           const base = parseFloat(item.price || 0);
//           const variant = parseFloat(item.options?.variant_total || 0);
//           const extra = parseFloat(item.options?.extra_price || 0);
//           return sum + (base + variant + extra) * qty;
//         }, 0);

//         return {
//           cartItems: items,
//           total: Number(total.toFixed(2)),
//           cartCount: items.length,
//         };
//       },

//       setCart: (items) => {
//         const normalized = items.map(item => ({
//           ...item,
//           quantity: Number(item.quantity) || 1,
//         }));
//         set(get().recalculate(normalized));
//       },

//       increment: (cartId, availableStock = Infinity) => {
//         set(state => {
//           const updatedItems = state.cartItems.map(item => {
//             if (item.id === cartId) {
//               const newQty = Number(item.quantity || 1) + 1;
//               if (newQty > availableStock) return item;
//               return { ...item, quantity: newQty };
//             }
//             return item;
//           });
//           return get().recalculate(updatedItems);
//         });

//         debouncedSync();
//       },

//       decrement: (cartId) => {
//         set(state => {
//           const updatedItems = state.cartItems
//             .map(item => {
//               if (item.id === cartId) {
//                 const newQty = Number(item.quantity || 1) - 1;
//                 if (newQty < 1) return null;
//                 return { ...item, quantity: newQty };
//               }
//               return item;
//             })
//             .filter(Boolean);

//           return get().recalculate(updatedItems);
//         });

//         debouncedSync();
//       },

//       remove: (cartId) => {
//         set(state => {
//           const updatedItems = state.cartItems.filter(item => item.id !== cartId);
//           return get().recalculate(updatedItems);
//         });

//         axios.delete(route('cart.remove', cartId)).catch(console.error);
//         debouncedSync();
//       },

//       clearCart: () => {
//         set({ cartItems: [], total: 0, cartCount: 0 });
//         axios.post(route('cart.clear')).catch(console.error);
//       },

//       syncCart: async () => {
//         const items = get().cartItems;
//         if (items.length === 0) return;

//         try {
//           const response = await axios.post(route('cart.sync'), {
//             items: items.map(i => ({
//               id: i.id,
//               quantity: Number(i.quantity),
//             })),
//           });

//           if (response.data?.cart_items) {
//             get().setCart(response.data.cart_items);
//           }
//         } catch (error) {
//           console.error('Cart sync failed:', error);
//         }
//       },
//     }),
//     {
//       name: 'cart-storage',
//       partialize: (state) => ({
//         cartItems: state.cartItems.map(item => ({
//           ...item,
//           quantity: Number(item.quantity),
//         })),
//       }),
//       onRehydrateStorage: () => (state) => {
//         if (state?.cartItems) {
//           const normalized = state.cartItems.map(item => ({
//             ...item,
//             quantity: Number(item.quantity) || 1,
//           }));
//           const recalculated = get().recalculate(normalized);
//           set(recalculated);
//         }
//       },
//     }
//   )
// );

// // Debounced sync
// const debouncedSync = debounce(() => {
//   useCartStore.getState().syncCart();
// }, 700);

// // Cancel on page unload
// window.addEventListener('beforeunload', () => {
//   debouncedSync.cancel();
// });

// export default useCartStore;


// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import axios from 'axios';
// import debounce from 'lodash/debounce';
// import { route } from 'ziggy-js';

// export const useCartStore = create(
//   persist(
//     (set, get) => ({
//       /* ======================
//          STATE
//       ====================== */
//       cartItems: [],
//       total: 0,
//       cartCount: 0,

//       /* ======================
//          RECALCULATE
//       ====================== */
//       recalculate: (items) => {
//         const total = items.reduce((sum, item) => {
//           const qty = Number(item.quantity) || 1;
//           const base = parseFloat(item.price || 0);
//           const variant = parseFloat(item.options?.variant_total || 0);
//           const extra = parseFloat(item.options?.extra_price || 0);
//           return sum + (base + variant + extra) * qty;
//         }, 0);

//         return {
//           cartItems: items,
//           total: Number(total.toFixed(2)),
//           cartCount: items.length,
//         };
//       },

//       /* ======================
//          SET CART (🔥 FIXED)
//       ====================== */
//       setCart: (items) => {
//         const oldItems = get().cartItems;

//         const merged = items.map(item => {
//           const old = oldItems.find(o => o.id === item.id);

//           return {
//             ...item,
//             quantity: Number(item.quantity) || 1,
//             options: {
//               ...(old?.options || {}),   // keep customization image
//               ...(item.options || {}),   // backend truth
//             },
//           };
//         });

//         set(get().recalculate(merged));
//       },

//       /* ======================
//          INCREMENT
//       ====================== */
//       increment: (cartId, availableStock = Infinity) => {
//         set(state => {
//           const updatedItems = state.cartItems.map(item => {
//             if (item.id === cartId) {
//               const newQty = Number(item.quantity || 1) + 1;
//               if (newQty > availableStock) return item;
//               return { ...item, quantity: newQty };
//             }
//             return item;
//           });

//           return get().recalculate(updatedItems);
//         });

//         debouncedSync();
//       },

//       /* ======================
//          DECREMENT
//       ====================== */
//       decrement: (cartId) => {
//         set(state => {
//           const updatedItems = state.cartItems
//             .map(item => {
//               if (item.id === cartId) {
//                 const newQty = Number(item.quantity || 1) - 1;
//                 if (newQty < 1) return null;
//                 return { ...item, quantity: newQty };
//               }
//               return item;
//             })
//             .filter(Boolean);

//           return get().recalculate(updatedItems);
//         });

//         debouncedSync();
//       },

//       /* ======================
//          REMOVE
//       ====================== */
//       remove: (cartId) => {
//         set(state => {
//           const updatedItems = state.cartItems.filter(item => item.id !== cartId);
//           return get().recalculate(updatedItems);
//         });

//         axios.delete(route('cart.remove', cartId)).catch(console.error);
//         debouncedSync();
//       },

//       /* ======================
//          CLEAR CART
//       ====================== */
//       clearCart: () => {
//         set({ cartItems: [], total: 0, cartCount: 0 });
//         axios.post(route('cart.clear')).catch(console.error);
//       },

//       /* ======================
//          SYNC CART
//       ====================== */
//       syncCart: async () => {
//         const items = get().cartItems;
//         if (items.length === 0) return;

//         try {
//           const response = await axios.post(route('cart.sync'), {
//             items: items.map(i => ({
//               id: i.id,
//               quantity: Number(i.quantity),
//             })),
//           });

//           if (response.data?.cart_items) {
//             get().setCart(response.data.cart_items);
//           }
//         } catch (error) {
//           console.error('Cart sync failed:', error);
//         }
//       },
//     }),
//     {
//       name: 'cart-storage',
//       partialize: (state) => ({
//         cartItems: state.cartItems.map(item => ({
//           ...item,
//           quantity: Number(item.quantity),
//         })),
//       }),
//       onRehydrateStorage: () => (state) => {
//         if (state?.cartItems) {
//           const normalized = state.cartItems.map(item => ({
//             ...item,
//             quantity: Number(item.quantity) || 1,
//           }));
//           const recalculated = get().recalculate(normalized);
//           set(recalculated);
//         }
//       },
//     }
//   )
// );

// /* ======================
//    DEBOUNCED SYNC
// ====================== */
// const debouncedSync = debounce(() => {
//   useCartStore.getState().syncCart();
// }, 700);

// /* ======================
//    CANCEL ON UNLOAD
// ====================== */
// window.addEventListener('beforeunload', () => {
//   debouncedSync.cancel();
// });

// export default useCartStore;


import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { route } from 'ziggy-js';

// Debounce setup
// Debounce setup
const debouncedSync = debounce(() => {
  useCartStore.getState().syncCart();
}, 500);

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      total: 0,
      cartCount: 0,
      version: 0, // 🔥 Versioning

      recalculate: (items) => {
        const total = items.reduce((sum, item) => {
          const qty = Number(item.quantity) || 1;
          const base = parseFloat(item.price || 0);
          const variant = parseFloat(item.options?.variant_total || 0);
          const extra = parseFloat(item.options?.extra_price || 0);
          return sum + (base + variant + extra) * qty;
        }, 0);

        return {
          cartItems: items,
          total: Number(total.toFixed(2)),
          cartCount: items.length,
        };
      },

      setCart: (items) => {
        const normalized = items.map(item => ({
          ...item,
          quantity: Number(item.quantity) || 1,
        }));
        set(get().recalculate(normalized));
      },

      increment: (cartId, availableStock = Infinity) => {
        set(state => {
          const updatedItems = state.cartItems.map(item => {
            if (item.id === cartId) {
              const newQty = Number(item.quantity || 1) + 1;
              if (newQty > availableStock) return item;
              return { ...item, quantity: newQty };
            }
            return item;
          });
          return { ...get().recalculate(updatedItems), version: Date.now() };
        });

        debouncedSync();
      },

      decrement: (cartId) => {
        set(state => {
          const updatedItems = state.cartItems
            .map(item => {
              if (item.id === cartId) {
                const newQty = Number(item.quantity || 1) - 1;
                if (newQty < 1) return null;
                return { ...item, quantity: newQty };
              }
              return item;
            })
            .filter(Boolean);
          return { ...get().recalculate(updatedItems), version: Date.now() };
        });

        debouncedSync();
      },

      remove: (cartId) => {
        set(state => {
          const updatedItems = state.cartItems.filter(item => item.id !== cartId);
          return { ...get().recalculate(updatedItems), version: Date.now() };
        });

        debouncedSync();

        axios.delete(route('cart.remove', cartId)).catch(console.error);
      },

      clearCart: () => {
        set({ cartItems: [], total: 0, cartCount: 0, version: Date.now() });

        debouncedSync();

        axios.post(route('cart.clear')).catch(console.error);
      },

      syncCart: async () => {
        const { cartItems, version } = get();
        if (cartItems.length === 0) return;

        const currentVersion = version;

        try {
          const response = await axios.post(route('cart.sync'), {
            items: cartItems.map(i => ({
              id: i.id,
              quantity: Number(i.quantity),
            })),
          });

          // If local version changed, discard response
          if (get().version !== currentVersion) return;

          if (response.data?.cart_items) {
            get().setCart(response.data.cart_items);
          }
        } catch (error) {
          console.error('Cart sync failed:', error);
        }
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        cartItems: state.cartItems.map(item => ({
          ...item,
          quantity: Number(item.quantity),
        })),
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.cartItems) {
          const normalized = state.cartItems.map(item => ({
            ...item,
            quantity: Number(item.quantity) || 1,
          }));
          const recalculated = get().recalculate(normalized);
          set(recalculated);
        }
      },
    }
  )
);

// Cancel on page unload
window.addEventListener('beforeunload', () => {
  if (debouncedSync) debouncedSync.cancel();
});

export default useCartStore;


