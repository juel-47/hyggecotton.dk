// import React, { useEffect } from "react";
// import { Link, router, usePage } from "@inertiajs/react";
// import { FaRegTrashAlt } from "react-icons/fa";
// import { toast } from "react-toastify";
// import { useCartStore } from "../stores/cartStore";

// const CartPage = () => {
//   const {
//     cart_items = [],
//     total: serverTotal = 0,
//     settings,
//     promotions = [],
//   } = usePage().props;

//   const { cartItems, total, setCart } = useCartStore();

//   // Sync server cart → Zustand
//   useEffect(() => {
//     setCart(cart_items);
//   }, [cart_items]);

//   // Quantity +
//   const handlePlus = (item) => {
//     if (item.options?.is_free_product) return;

//     const stock = item.product?.qty ?? 999;

//     if (item.quantity >= stock) {
//       toast.warn(`মাত্র ${stock} টি পাওয়া যাচ্ছে`);
//       return;
//     }

//     router.post(
//       route("cart.update"),
//       {
//         cart_id: item.id,
//         quantity: item.quantity + 1,
//       },
//       { preserveScroll: true }
//     );
//   };

//   // Quantity -
//   const handleMinus = (item) => {
//     if (item.options?.is_free_product) return;
//     if (item.quantity <= 1) return;

//     router.post(
//       route("cart.update"),
//       {
//         cart_id: item.id,
//         quantity: item.quantity - 1,
//       },
//       { preserveScroll: true }
//     );
//   };

//   // Remove item
//   const handleRemove = (item) => {
//     if (item.options?.is_free_product) return;

//     router.delete(route("cart.remove", item.id), {
//       preserveScroll: true,
//       onSuccess: () => toast.success("কার্ট থেকে সরানো হয়েছে"),
//     });
//   };

//   return (
//     <div className="min-h-screen py-8 bg-dark1">
//       <div className="max-w-[1200px] mx-auto px-4 2xl:px-20">
//         <h1 className="text-xl md:text-3xl font-bold text-cream mb-8">
//           আপনার শপিং কার্ট
//         </h1>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {/* Cart Items */}
//           <div className="md:col-span-2">
//             <div className="bg-dark2 rounded-lg shadow-md">
//               <div className="p-6 border-b border-gray/30">
//                 <h2 className="text-xl font-semibold text-gray">
//                   কার্টে আইটেম আছে ({cartItems.length})
//                 </h2>
//               </div>

//               {cartItems.length === 0 ? (
//                 <div className="p-6 text-center text-gray">
//                   আপনার কার্ট খালি
//                 </div>
//               ) : (
//                 cartItems.map((item) => {
//                   const isFree = item.options?.is_free_product === true;

//                   const thumb = item.product?.thumb_image
//                     ? `/${item.product.thumb_image}`
//                     : null;

//                   const front = item.customization?.front_image
//                     ? `/${item.customization.front_image}`
//                     : null;

//                   const back = item.customization?.back_image
//                     ? `/${item.customization.back_image}`
//                     : null;

//                   const itemPrice =
//                     Number(item.price) +
//                     Number(item.options?.variant_total || 0) +
//                     Number(item.options?.extra_price || 0);

//                   const itemTotal = itemPrice * item.quantity;

//                   return (
//                     <div
//                       key={item.id}
//                       className="p-6 flex flex-col sm:flex-row gap-6 border-b border-gray/30"
//                     >
//                       {/* Images */}
//                       <div className="flex gap-2">
//                         {thumb && (
//                           <img
//                             src={thumb}
//                             className="w-24 h-24 rounded object-cover"
//                             alt=""
//                           />
//                         )}
//                         {front && (
//                           <img
//                             src={front}
//                             className="w-24 h-24 rounded object-cover"
//                             alt=""
//                           />
//                         )}
//                         {back && (
//                           <img
//                             src={back}
//                             className="w-24 h-24 rounded object-cover"
//                             alt=""
//                           />
//                         )}
//                       </div>

//                       {/* Details */}
//                       <div className="flex-1">
//                         <h3 className="text-lg font-medium text-cream">
//                           {item.product?.name}
//                         </h3>

//                         {isFree && (
//                           <span className="inline-block mt-2 px-3 py-1 bg-green-600 text-white text-xs rounded-full">
//                             🎁 ফ্রি প্রোডাক্ট
//                           </span>
//                         )}

//                         {item.options?.size_name && (
//                           <p className="text-sm text-gray mt-1">
//                             সাইজ: {item.options.size_name}
//                           </p>
//                         )}

//                         {item.options?.color_name && (
//                           <p className="text-sm text-gray">
//                             কালার: {item.options.color_name}
//                           </p>
//                         )}

//                         <p className="text-gray font-bold mt-2">
//                           {isFree
//                             ? "ফ্রি"
//                             : `${settings?.currency_icon}${itemPrice}`}
//                         </p>

//                         <div className="flex items-center gap-3 mt-4">
//                           {!isFree ? (
//                             <>
//                               <button
//                                 onClick={() => handleMinus(item)}
//                                 className="w-8 h-8 bg-gray-300 rounded"
//                               >
//                                 −
//                               </button>
//                               <span className="w-10 text-center text-cream">
//                                 {item.quantity}
//                               </span>
//                               <button
//                                 onClick={() => handlePlus(item)}
//                                 className="w-8 h-8 bg-gray-300 rounded"
//                               >
//                                 +
//                               </button>
//                               <button
//                                 onClick={() => handleRemove(item)}
//                                 className="text-red-600 ml-4"
//                               >
//                                 <FaRegTrashAlt />
//                               </button>
//                             </>
//                           ) : (
//                             <span className="text-green-400 text-sm">
//                               কোয়ান্টিটি: {item.quantity}
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       {/* Total */}
//                       <div className="text-cream font-bold self-center">
//                         {isFree
//                           ? "ফ্রি"
//                           : `${settings?.currency_icon}${itemTotal}`}
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           </div>

//           {/* Summary */}
//           <div>
//             <div className="bg-dark2 p-6 rounded-lg sticky top-8">
//               {promotions.length > 0 && (
//                 <div className="mb-6 p-4 bg-green-900/30 border border-green-600 rounded">
//                   <h3 className="text-green-400 font-bold mb-2">
//                     🎉 অফার চালু হয়েছে
//                   </h3>
//                   {promotions.map((promo, i) => (
//                     <p key={i} className="text-green-300 text-sm">
//                       {promo.message}
//                     </p>
//                   ))}
//                 </div>
//               )}

//               <div className="flex justify-between text-cream mb-4">
//                 <span>সাবটোটাল</span>
//                 <span>
//                   {settings?.currency_icon}
//                   {total}
//                 </span>
//               </div>

//               <div className="flex justify-between text-xl font-bold text-cream border-t pt-4">
//                 <span>মোট দাম</span>
//                 <span>
//                   {settings?.currency_icon}
//                   {total}
//                 </span>
//               </div>

//               <Link
//                 href={route("checkout")}
//                 className="w-full mt-6 bg-green-600 text-white py-3 rounded block text-center font-bold hover:bg-green-700 transition"
//               >
//                 চেকআউট করুন
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartPage;


// import React, { useEffect } from "react";
// import { toast } from "react-toastify";
// import { FaRegTrashAlt } from "react-icons/fa";
// import { Link, usePage } from "@inertiajs/react";
// import { useCartStore } from "../stores/cartStore"; // পাথ অনুযায়ী পরিবর্তন করো

// const CartPage = () => {
//   const { cart_items, total: serverTotal, settings } = usePage().props;
//   const { cartItems, total, setCart, increment, decrement, remove } = useCartStore();

//   // পেজ লোডে প্রথমবার সার্ভার থেকে ডাটা নিয়ে স্টোরে সেট করা
//   // useEffect(() => {
//   //   if (cart_items?.length > 0) {
//   //     setCart(cart_items, serverTotal);
//   //   }
//   // }, [cart_items, serverTotal]);
//     useEffect(() => {
//     // server থেকে আসা cart_items যেকোনো অবস্থায় store এ set করো
//     setCart(cart_items ?? [], serverTotal ?? 0);
//   }, [cart_items, serverTotal]);

//   // স্টক চেক (যদি প্রোডাক্টের qty না থাকে তাহলে item.product.qty ব্যবহার করো)
//   const handlePlus = (id, currentQty, availableStock) => {
//     if (currentQty >= availableStock) {
//       toast.warn(`Only ${availableStock} item(s) available`);
//       return;
//     }
//     increment(id, availableStock);
//   };

//   const handleMinus = (id, currentQty) => {
//     if (currentQty <= 1) return;
//     decrement(id);
//   };

//   const handleRemove = (id) => {
//     // if (!confirm("Remove this item?")) return;
//     remove(id);
//     toast.success("Product removed from cart");
//   };

//   return (
//     <div className="min-h-screen py-8 bg-dark1">
//       <div className="max-w-[1200px] mx-auto px-4 2xl:px-20">
//         <h1 className="text-xl md:text-3xl font-bold text-cream mb-8">Your Shopping</h1>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           <div className="md:col-span-2">
//             <div className="bg-dark2 rounded-lg shadow-md">
//               <div className="p-6 border-b border-gray/30">
//                 <h2 className="text-xl font-semibold text-gray">
//                   Cart Items ({cartItems.length})
//                 </h2>
//               </div>

//               {cartItems.length === 0 ? (
//                 <div className="p-6 text-center text-gray">Your cart is empty</div>
//               ) : (
//                 cartItems.map((item) => {
//                   const thumb = item.product?.thumb_image ? `/${item.product.thumb_image}` : null;
//                   const front = item.customization?.front_image ? `/${item.customization.front_image}` : null;
//                   const back = item.customization?.back_image ? `/${item.customization.back_image}` : null;
//                   const availableStock = item.product?.qty || 999;

//                   return (
//                     <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 border-b border-gray/30">
//                       {/* Images */}
//                       <div className="flex gap-2">
//                         {thumb && <img src={thumb} className="w-24 h-24 rounded" />}
//                         {front && <img src={front} className="w-24 h-24 rounded" />}
//                         {back && <img src={back} className="w-24 h-24 rounded" />}
//                       </div>

//                       {/* Details */}
//                       <div className="flex-1">
//                         <h3 className="text-lg font-medium text-cream">{item.product?.name}</h3>
//                         <p className="text-gray font-bold">
//                           {settings?.currency_icon}{Number(item.price)}
//                         </p>
//                         {item?.customization?.price > 0 && (
//                           <p className="text-sm text-gray">
//                             Extra: {settings?.currency_icon}{item.customization.price}
//                           </p>
//                         )}

//                         <div className="flex items-center gap-3 mt-4">
//                           <button
//                             onClick={() => handleMinus(item.id, item.quantity)}
//                             className="w-8 h-8 bg-gray-300 rounded"
//                             disabled={item.quantity <= 1}
//                           >
//                             −
//                           </button>
//                           <span className="w-10 text-center text-cream">{item.quantity}</span>
//                           <button
//                             onClick={() => handlePlus(item.id, item.quantity, availableStock)}
//                             className="w-8 h-8 bg-gray-300 rounded"
//                           >
//                             +
//                           </button>
//                           <button onClick={() => handleRemove(item.id)} className="text-red-600 ml-4">
//                             <FaRegTrashAlt />
//                           </button>
//                         </div>
//                       </div>

//                       {/* Total */}
//                       <div className="text-cream font-bold">
//                         {settings?.currency_icon}{(item.price * item.quantity).toFixed(2)}
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           </div>

//           {/* Summary */}
//           <div>
//             <div className="bg-dark2 p-6 rounded-lg sticky top-8">
//               <div className="flex justify-between text-cream mb-4">
//                 <span>Subtotal</span>
//                 <span>{settings?.currency_icon}{total}</span>
//               </div>
//               <div className="flex justify-between text-xl font-bold text-cream border-t pt-4">
//                 <span>Total</span>
//                 <span>{settings?.currency_icon}{total}</span>
//               </div>
//               {/* <button className="w-full mt-6 bg-green-600 text-white py-3 rounded">
//                 Proceed to Checkout
//               </button> */}
//               <Link
//       href={route("checkout")} 
//       className="w-full mt-6 bg-green-600 text-white py-3 rounded block text-center font-bold hover:bg-green-700 transition"
//     >
//       Proceed to Checkout
//     </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartPage;


import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { FaRegTrashAlt } from "react-icons/fa";
import { Link, usePage } from "@inertiajs/react";
import { useCartStore } from "../stores/cartStore"; // adjust path if needed

const CartPage = () => {
  const { cart_items, total: serverTotal, settings, promotions = [] } = usePage().props;
  const { cartItems, total, setCart, increment, decrement, remove } = useCartStore();
  // console.log('cartImtes',cartItems, 'cartTotal',total);

  // Initialize cart store with server data
  useEffect(() => {
    setCart(cart_items ?? [], serverTotal ?? 0);
  }, [cart_items, serverTotal]);

  // Increment quantity
  const handlePlus = (id, currentQty, availableStock) => {
    if (currentQty >= availableStock) {
      toast.warn(`Only ${availableStock} item(s) available`);
      return;
    }
    increment(id, availableStock);
  };

  // Decrement quantity
  const handleMinus = (id, currentQty) => {
    if (currentQty <= 1) return;
    decrement(id);
  };

  // Remove item
  const handleRemove = (id) => {
    remove(id);
    toast.success("Product removed from cart");
  };

  return (
    <div className="min-h-screen py-8 bg-dark1">
      <div className="max-w-[1200px] mx-auto px-4 2xl:px-20">
        <h1 className="text-xl md:text-3xl font-bold text-cream mb-8">
          Your Shopping Cart
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2">
            <div className="bg-dark2 rounded-lg shadow-md">
              <div className="p-6 border-b border-gray/30">
                <h2 className="text-xl font-semibold text-gray">
                  Cart Items ({cartItems.length})
                </h2>
              </div>

              {cartItems.length === 0 ? (
                <div className="p-6 text-center text-gray">Your cart is empty</div>
              ) : (
                cartItems.map((item) => {
                  const isFree = item.options?.is_free_product === true;
                  const thumb = item.product?.thumb_image ? `/${item.product.thumb_image}` : null;
                  const front = item.customization?.front_image ? `/${item.customization.front_image}` : item.options?.front_image ? `/${item.options.front_image}` : null;
                  const back = item.customization?.back_image ? `/${item.customization.back_image}` : item.options?.back_image ? `/${item.options.back_image}` : null;
                  const availableStock = item.product?.qty || 999;

                  const itemPrice =
                    Number(item.price) +
                    Number(item.options?.variant_total || 0) +
                    Number(item.options?.extra_price || 0);

                  const itemTotal = isFree ? 0 : itemPrice * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="p-6 flex flex-col sm:flex-row gap-6 border-b border-gray/30"
                    >
                      {/* Images */}
                      <div className="flex gap-2">
                        {thumb && <img src={thumb} className="w-24 h-24 rounded" />}
                        {front && <img src={front} className="w-24 h-24 rounded" />}
                        {back && <img src={back} className="w-24 h-24 rounded" />}
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-cream">{item.product?.name}</h3>

                        {isFree && (
                          <span className="inline-block mt-2 px-3 py-1 bg-green-600 text-white text-xs rounded-full">
                            🎁 Free Product
                          </span>
                        )}

                        {!isFree && item.options?.size_name && (
                          <p className="text-sm text-gray mt-1">Size: {item.options.size_name}</p>
                        )}
                        {!isFree && item.options?.color_name && (
                          <p className="text-sm text-gray">Color: {item.options.color_name}</p>
                        )}

                        <p className="text-gray font-bold mt-2">
                          {isFree
                            ? "Free"
                            : `${settings?.currency_icon}${Number.parseFloat(item.price)}`}
                        </p>
{/* 
                        {item?.customization?.price > 0 && !isFree && (
                          <p className="text-sm text-gray">
                            Extra: {settings?.currency_icon}{Number.parseFloat(item.customization.price)}
                          </p>
                        )}
                         {item?.options?.price > 0 && !isFree && (
                          <p className="text-sm text-gray">
                            Extra: {settings?.currency_icon}{Number.parseFloat(item.options.price)}
                          </p>
                        )} */}

                        {

                          item?.customization? 
                        item?.customization?.price > 0 && !isFree && (
                          <p className="text-sm text-gray">
                            Extra: {settings?.currency_icon}{Number.parseFloat(item.customization.price)}
                          </p>
                        ): item?.options?.extra_price > 0 && !isFree && (
                          <p className="text-sm text-gray">
                            Extra: {settings?.currency_icon}{Number.parseFloat(item.options.extra_price)}
                          </p>
                        )
                        }

                        <div className="flex items-center gap-3 mt-4">
                          {!isFree ? (
                            <>
                              <button
                                onClick={() => handleMinus(item.id, item.quantity)}
                                className="w-8 h-8 bg-gray-300 rounded"
                                disabled={item.quantity <= 1}
                              >
                                −
                              </button>
                              <span className="w-10 text-center text-cream">{item.quantity}</span>
                              <button
                                onClick={() => handlePlus(item.id, item.quantity, availableStock)}
                                className="w-8 h-8 bg-gray-300 rounded"
                              >
                                +
                              </button>
                              <button
                                onClick={() => handleRemove(item.id)}
                                className="text-red-600 ml-4"
                              >
                                <FaRegTrashAlt />
                              </button>
                            </>
                          ) : (
                            <span className="text-green-400 text-sm">Quantity: {item.quantity}</span>
                          )}
                        </div>
                      </div>

                      {/* Total */}
                      <div className="text-cream font-bold self-center">
                        {isFree ? "Free" : `${settings?.currency_icon}${Number.parseFloat(itemTotal)}`}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-dark2 p-6 rounded-lg sticky top-8">
              {/* {promotions.length > 0 && (
                <di className="mb-6 p-4 bg-green-900/30 border border-green-600 rounded">
                  <h3 className="text-green-400 font-bold mb-2">🎉 Offers Active</h3>
                  {promotions.map((promo, i) => (
                    <p key={i} className="text-green-300 text-sm">
                      {promo.message}
                    </p>
                  ))}
                </di
                v>
              )} */}

              <div className="flex justify-between text-cream mb-4">
                <span>Subtotal</span>
                <span>
                  {settings?.currency_icon}
                  {total}
                </span>
              </div>

              <div className="flex justify-between text-xl font-bold text-cream border-t pt-4">
                <span>Total</span>
                <span>
                  {settings?.currency_icon}
                  {total}
                </span>
              </div>

              <Link
                href={route("checkout")}
                className="w-full mt-6 bg-green-600 text-white py-3 rounded block text-center font-bold hover:bg-green-700 transition"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
