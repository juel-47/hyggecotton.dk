// pages/CartPage.jsx
// import React, { useEffect } from "react"; 

// import { toast } from "react-toastify";
// import { FaRegTrashAlt } from "react-icons/fa";
// import { usePage } from "@inertiajs/react";

// const CartPage = ({cart_items,total}) => {
//     const {settings} = usePage().props;
//     // console.log(cart_items);
//     // Plus Button
//     const handlePlus = (id, currentQty, availableStock) => {
//         const qty = Number(currentQty) || 0;
//         const stock = Number(availableStock) || 0;

//         if (qty >= stock) {
//             toast.warn(`Only ${stock} item(s) available in stock`);
//             return;
//         }

//         handleQuantityChange(id, qty + 1);
//     };

//     // Minus Button
//     const handleMinus = (id, currentQty) => {
//         const qty = Number(currentQty) || 0;
//         if (qty <= 1) return;
//         handleQuantityChange(id, qty - 1);
//     };




//     return (
//         <div className="min-h-screen py-8  bg-dark1">
//             <div className="max-w-[1200px] mx-auto px-4 2xl:px-20">
//                 <div className="max-w-6xl mx-auto">
//                     <h1 className="text-xl md:text-3xl md:font-bold text-cream mb-8">
//                         Your Shopping 
//                     </h1>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                         {/* Cart Items */}
//                         <div className="md:col-span-2">
//                             <div className="bg-dark2 rounded-lg shadow-md overflow-hidden">
//                                 <div className="p-6 border-b border-gray/30">
//                                     <h2 className="text-xl font-semibold text-gray">
//                                         Cart Items (
//                                         {cart_items
//                                             ?.length || 0}
//                                         )
//                                     </h2>
//                                 </div>

//                                 <div className="divide-y divide-gray/30">
//                                     {cart_items?.length ===
//                                     0 ? (
//                                         <div className="p-6 text-center text-gray">
//                                             Your cart is empty
//                                         </div>
//                                     ) : (
//                                         cart_items?.map(
//                                             (item) => {
//                                                 const hasImage = (path) =>
//                                                     path && path.trim() !== "";
//                                                 const thumb = hasImage(
//                                                     item.product?.thumb_image
//                                                 )
//                                                     ? `/${item.product.thumb_image}`
//                                                     : null;
//                                                 const front = hasImage(
//                                                     item?.customization?.front_image
//                                                 )
//                                                     ? `/${item.customization.front_image}`
//                                                     : null;
//                                                 const back = hasImage(
//                                                     item?.customization?.back_image
//                                                 )
//                                                     ? `/${item.customization.back_image}`
//                                                     : null;
//                                                 const hasAnyImage =
//                                                     thumb || front || back;

//                                                 // স্টক কত আছে
//                                                 const availableStock =
//                                                     item.product?.qty || 0;
//                                                 const currentQty =
//                                                     item.quantity || 1;
//                                                 const isMaxReached =
//                                                     currentQty >=
//                                                     availableStock;

//                                                 console.log(item);

//                                                 return (
//                                                     <div
//                                                         key={item.id}
//                                                         className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
//                                                     >
//                                                         {/* Images */}
//                                                         <div className="flex flex-wrap gap-2">
//                                                             {thumb && (
//                                                                 <img
//                                                                     src={thumb}
//                                                                     alt=""
//                                                                     className="w-24 h-24 object-cover rounded-lg"
//                                                                 />
//                                                             )}
//                                                             {front && (
//                                                                 <img
//                                                                     src={front}
//                                                                     alt=""
//                                                                     className="w-24 h-24 object-contain rounded-lg"
//                                                                 />
//                                                             )}
//                                                             {back && (
//                                                                 <img
//                                                                     src={back}
//                                                                     alt=""
//                                                                     className="w-24 h-24 object-cover rounded-lg"
//                                                                 />
//                                                             )}
//                                                             {!hasAnyImage && (
//                                                                 <div className="w-24 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-500">
//                                                                     No Image
//                                                                 </div>
//                                                             )}
//                                                         </div>

//                                                         {/* Details */}
//                                                         <div className="flex-1">
//                                                             <h3 className="text-lg font-medium text-cream">
//                                                                 {
//                                                                     item
//                                                                         ?.product
//                                                                         ?.name
//                                                                 }
//                                                             </h3>
//                                                             <p className="text-sm md:text-lg font-bold text-gray mt-1">
//                                                                 {

//                                                                         settings
//                                                                         ?.currency_icon
//                                                                 }
//                                                                 {Number(
//                                                                     item.price
//                                                                 )}
//                                                             </p>
//                                                             <p className="text-sm font-bold text-gray mt-1">
//                                                                 Extra Price
//                                                                 {

//                                                                         settings
//                                                                         ?.currency_icon
//                                                                 }
//                                                                 {Number(
//                                                                     item.customization.price
//                                                                 )}
//                                                             </p>

//                                                             <div className="flex flex-wrap items-center gap-3 mt-4">
//                                                                 {/* Quantity */}
//                                                                 {/* <div className="flex">
//                                                                     <button
//                                                                         onClick={() =>
//                                                                             handleMinus(
//                                                                                 item.id,
//                                                                                 item.quantity
//                                                                             )
//                                                                         }
//                                                                         className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-l-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                                                                         disabled={
//                                                                             item.quantity <=
//                                                                             1
//                                                                         }
//                                                                     >
//                                                                         −
//                                                                     </button>

//                                                                     <span className="w-12 h-8 flex items-center justify-center bg-gray-100 font-medium">
//                                                                         {
//                                                                             item.quantity
//                                                                         }
//                                                                     </span>

//                                                                     <button
//                                                                         onClick={() =>
//                                                                             handlePlus(
//                                                                                 item.id,
//                                                                                 item.quantity,
//                                                                                 availableStock
//                                                                             )
//                                                                         }
//                                                                         className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-r-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                                                                         disabled={
//                                                                             isMaxReached
//                                                                         }
//                                                                     >
//                                                                         +
//                                                                     </button>
//                                                                 </div> */}



//                                                                 {/* {item.customization_id ? (
//                                                                 <Link
//                                                                     to={{
//                                                                         pathname: `/product/${item.product.slug}/customize`,
//                                                                         state: {
//                                                                             redo: true,  
//                                                                             cartItemId:
//                                                                                 item.id,  
//                                                                         },
//                                                                     }}
//                                                                     className="text-indigo-600 hover:underline font-medium"
//                                                                 >
//                                                                     Redo
//                                                                     Customization
//                                                                 </Link>
//                                                             ) : null} */}
//                                                                 {/* <Link
//                                                                 to={{
//                                                                     pathname: `/product/${item?.product?.slug}/customize`,
//                                                                     state: {
//                                                                         removeFromCartFirst: true, 
//                                                                         cartItemId:
//                                                                             item.id, 
//                                                                     },
//                                                                 }}
//                                                                 className="text-green-600 hover:text-green-400 font-medium underline"
//                                                             >
//                                                                 Customize Again
//                                                             </Link> */}
//                                                                 <button

//                                                                     className="text-red-600 hover:text-red-700 cursor-pointer"
//                                                                 >
//                                                                     <FaRegTrashAlt />
//                                                                 </button>
//                                                             </div>
//                                                         </div>

//                                                         {/* Total */}

//                                                         <div className="mt-2 sm:mt-0">
//                                                             <p className="text-lg font-bold text-cream">
//                                                                 {settings?.currency_icon
//                                                                 }
//                                                                 {Number(
//                                                                     item.price ?? 0
//                                                                 ) *
//                                                                     item.quantity}
//                                                             </p>
//                                                         </div>
//                                                     </div>
//                                                 );
//                                             }
//                                         )
//                                     )}
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Order Summary */}
//                         <div className="md:col-span-1">
//                             <div className="bg-dark2 rounded-lg shadow-md sticky top-8">
//                                 <div className="p-6 border-b border-gray/30">
//                                     <h2 className="text-xl font-semibold text-cream">
//                                         Order Summary
//                                     </h2>
//                                 </div>
//                                 <div className="p-6">
//                                     <div className="flex justify-between mb-2">
//                                         <span className="text-cream">
//                                             Subtotal
//                                         </span>
//                                         <span className="font-medium text-cream">
//                                             {settings?.currency_icon}
//                                             {total}
//                                         </span>
//                                     </div>
//                                     {/* <div className="flex justify-between mb-4">
//                                         <span className="text-cream">
//                                             Discount
//                                         </span>
//                                         <span className="font-medium text-green-600">
//                                             -{settings?.currency_icon}
//                                             {Number(
//                                                 cartSummery?.data?.discount || 0
//                                             )}
//                                         </span>
//                                     </div> */}
//                                     <div className="flex justify-between text-lg font-bold mb-6 pt-4 border-t border-gray/30">
//                                         <span className="text-cream">
//                                             Total
//                                         </span>
//                                         <span className="text-cream">
//                                             {settings?.currency_icon}
//                                             {total}
//                                         </span>
//                                     </div>

//                                     <button
//                                         onClick={() => {
//                                             if (!token) {
//                                                 // Current page-এ ফিরে আসার জন্য URL পাস করো
//                                                 const currentPath =
//                                                     window.location.pathname;
//                                                 navigate(
//                                                     `/signin?redirect=${encodeURIComponent(
//                                                         currentPath
//                                                     )}`
//                                                 );
//                                                 toast.warn(
//                                                     "Please login to continue shopping!",
//                                                     {
//                                                         position: "top-center",
//                                                     }
//                                                 );
//                                             } else {
//                                                 navigate("/checkout");
//                                             }
//                                         }}
//                                         className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"

//                                     >
//                                         Proceed to Checkout
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CartPage;


// pages/CartPage.jsx


// import React from "react";
// import { toast } from "react-toastify";
// import { FaRegTrashAlt } from "react-icons/fa";
// import { usePage, router } from "@inertiajs/react";
// import { Link } from "@inertiajs/react";
// import { route } from "ziggy-js";

// const CartPage = ({ cart_items, total }) => {
//     const { settings } = usePage().props;

//     /* ===============================
//        Quantity Update (Inertia)
//     ================================ */
//     const handleQuantityChange = (cartId, qty) => {
//         router.post(
//             route("cart.update"),
//             {
//                 cart_id: cartId,
//                 quantity: qty,
//             },
//             {
//                 preserveScroll: true,
//                 onError: () => {
//                     toast.error("Quantity update failed!");
//                 },
//             }
//         );
//     };

//     /* ===============================
//        Plus Button
//     ================================ */
//     const handlePlus = (id, currentQty, availableStock) => {
//         const qty = Number(currentQty) || 0;
//         const stock = Number(availableStock) || 0;

//         if (qty >= stock) {
//             toast.warn(`Only ${stock} item(s) available`);
//             return;
//         }

//         handleQuantityChange(id, qty + 1);
//     };

//     /* ===============================
//        Minus Button
//     ================================ */
//     const handleMinus = (id, currentQty) => {
//         const qty = Number(currentQty) || 0;
//         if (qty <= 1) return;

//         handleQuantityChange(id, qty - 1);
//     };

//     /* ===============================
//        Remove Item
//     ================================ */
//     const handleRemove = (id) => {
//         // if (!confirm("Remove this item from cart?")) return;

//         router.delete(route("cart.remove", id), {
//             preserveScroll: true,
//             onSuccess: () => {
//                 toast.success("Item removed from cart");
//             },
//         });
//     };

//     return (
//         <div className="min-h-screen py-8 bg-dark1">
//             <div className="max-w-[1200px] mx-auto px-4 2xl:px-20">
//                 <h1 className="text-xl md:text-3xl font-bold text-cream mb-8">
//                     Your Shopping
//                 </h1>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                     {/* ================= Cart Items ================= */}
//                     <div className="md:col-span-2">
//                         <div className="bg-dark2 rounded-lg shadow-md">
//                             <div className="p-6 border-b border-gray/30">
//                                 <h2 className="text-xl font-semibold text-gray">
//                                     Cart Items ({cart_items?.length || 0})
//                                 </h2>
//                             </div>

//                             {cart_items?.length === 0 ? (
//                                 <div className="p-6 text-center text-gray">
//                                     Your cart is empty
//                                 </div>
//                             ) : (
//                                 cart_items.map((item) => {
//                                     const thumb = item.product?.thumb_image
//                                         ? `/${item.product.thumb_image}`
//                                         : null;
//                                     const front = item?.customization?.front_image
//                                         ? `/${item.customization.front_image}`
//                                         : null;
//                                     const back = item?.customization?.back_image
//                                         ? `/${item.customization.back_image}`
//                                         : null;

//                                     const availableStock = item.product?.qty || 0;

//                                     return (
//                                         <div
//                                             key={item.id}
//                                             className="p-6 flex flex-col sm:flex-row gap-6 border-b border-gray/30"
//                                         >
//                                             {/* Images */}
//                                             <div className="flex gap-2">
//                                                 {thumb && (
//                                                     <img
//                                                         src={thumb}
//                                                         className="w-24 h-24 rounded"
//                                                     />
//                                                 )}
//                                                 {front && (
//                                                     <img
//                                                         src={front}
//                                                         className="w-24 h-24 rounded"
//                                                     />
//                                                 )}
//                                                 {back && (
//                                                     <img
//                                                         src={back}
//                                                         className="w-24 h-24 rounded"
//                                                     />
//                                                 )}
//                                             </div>

//                                             {/* Details */}
//                                             <div className="flex-1">
//                                                 <h3 className="text-lg font-medium text-cream">
//                                                     {item.product?.name}
//                                                 </h3>

//                                                 <p className="text-gray font-bold">
//                                                     {settings?.currency_icon}
//                                                     {Number(item.price)}
//                                                 </p>

//                                                 {item?.customization?.price > 0 && (
//                                                     <p className="text-sm text-gray">
//                                                         Extra: {settings?.currency_icon}
//                                                         {item.customization.price}
//                                                     </p>
//                                                 )}

//                                                 {/* Quantity */}
//                                                 <div className="flex items-center gap-3 mt-4">
//                                                     <button
//                                                         onClick={() =>
//                                                             handleMinus(
//                                                                 item.id,
//                                                                 item.quantity
//                                                             )
//                                                         }
//                                                         className="w-8 h-8 bg-gray-300 rounded"
//                                                         disabled={item.quantity <= 1}
//                                                     >
//                                                         −
//                                                     </button>

//                                                     <span className="w-10 text-center text-cream">
//                                                         {item.quantity}
//                                                     </span>

//                                                     <button
//                                                         onClick={() =>
//                                                             handlePlus(
//                                                                 item.id,
//                                                                 item.quantity,
//                                                                 availableStock
//                                                             )
//                                                         }
//                                                         className="w-8 h-8 bg-gray-300 rounded"
//                                                     >
//                                                         +
//                                                     </button>

//                                                     {/* Remove */}
//                                                     <button
//                                                         onClick={() =>
//                                                             handleRemove(item.id)
//                                                         }
//                                                         className="text-red-600 ml-4"
//                                                     >
//                                                         <FaRegTrashAlt />
//                                                     </button>
//                                                 </div>
//                                             </div>

//                                             {/* Total */}
//                                             <div className="text-cream font-bold">
//                                                 {settings?.currency_icon}
//                                                 {item.price * item.quantity}
//                                             </div>
//                                         </div>
//                                     );
//                                 })
//                             )}
//                         </div>
//                     </div>

//                     {/* ================= Summary ================= */}
//                     <div>
//                         <div className="bg-dark2 p-6 rounded-lg sticky top-8">
//                             <div className="flex justify-between text-cream mb-4">
//                                 <span>Subtotal</span>
//                                 <span>
//                                     {settings?.currency_icon}
//                                     {total}
//                                 </span>
//                             </div>

//                             <div className="flex justify-between text-xl font-bold text-cream border-t pt-4">
//                                 <span>Total</span>
//                                 <span>
//                                     {settings?.currency_icon}
//                                     {total}
//                                 </span>
//                             </div>

//                             <button className="w-full mt-6 bg-green-600 text-white py-3 rounded">
//                                 Proceed to Checkout
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CartPage;


import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { FaRegTrashAlt } from "react-icons/fa";
import { Link, usePage } from "@inertiajs/react";
import { useCartStore } from "../stores/cartStore"; // পাথ অনুযায়ী পরিবর্তন করো

const CartPage = () => {
  const { cart_items, total: serverTotal, settings } = usePage().props;
  const { cartItems, total, setCart, increment, decrement, remove } = useCartStore();

  // পেজ লোডে প্রথমবার সার্ভার থেকে ডাটা নিয়ে স্টোরে সেট করা
  // useEffect(() => {
  //   if (cart_items?.length > 0) {
  //     setCart(cart_items, serverTotal);
  //   }
  // }, [cart_items, serverTotal]);
    useEffect(() => {
    // server থেকে আসা cart_items যেকোনো অবস্থায় store এ set করো
    setCart(cart_items ?? [], serverTotal ?? 0);
  }, [cart_items, serverTotal]);

  // স্টক চেক (যদি প্রোডাক্টের qty না থাকে তাহলে item.product.qty ব্যবহার করো)
  const handlePlus = (id, currentQty, availableStock) => {
    if (currentQty >= availableStock) {
      toast.warn(`Only ${availableStock} item(s) available`);
      return;
    }
    increment(id, availableStock);
  };

  const handleMinus = (id, currentQty) => {
    if (currentQty <= 1) return;
    decrement(id);
  };

  const handleRemove = (id) => {
    // if (!confirm("Remove this item?")) return;
    remove(id);
    toast.success("Product removed from cart");
  };

  return (
    <div className="min-h-screen py-8 bg-dark1">
      <div className="max-w-[1200px] mx-auto px-4 2xl:px-20">
        <h1 className="text-xl md:text-3xl font-bold text-cream mb-8">Your Shopping</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                  const thumb = item.product?.thumb_image ? `/${item.product.thumb_image}` : null;
                  const front = item.customization?.front_image ? `/${item.customization.front_image}` : null;
                  const back = item.customization?.back_image ? `/${item.customization.back_image}` : null;
                  const availableStock = item.product?.qty || 999;

                  return (
                    <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 border-b border-gray/30">
                      {/* Images */}
                      <div className="flex gap-2">
                        {thumb && <img src={thumb} className="w-24 h-24 rounded" />}
                        {front && <img src={front} className="w-24 h-24 rounded" />}
                        {back && <img src={back} className="w-24 h-24 rounded" />}
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-cream">{item.product?.name}</h3>
                        <p className="text-gray font-bold">
                          {settings?.currency_icon}{Number(item.price)}
                        </p>
                        {item?.customization?.price > 0 && (
                          <p className="text-sm text-gray">
                            Extra: {settings?.currency_icon}{item.customization.price}
                          </p>
                        )}

                        <div className="flex items-center gap-3 mt-4">
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
                          <button onClick={() => handleRemove(item.id)} className="text-red-600 ml-4">
                            <FaRegTrashAlt />
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="text-cream font-bold">
                        {settings?.currency_icon}{(item.price * item.quantity).toFixed(2)}
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
              <div className="flex justify-between text-cream mb-4">
                <span>Subtotal</span>
                <span>{settings?.currency_icon}{total}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-cream border-t pt-4">
                <span>Total</span>
                <span>{settings?.currency_icon}{total}</span>
              </div>
              {/* <button className="w-full mt-6 bg-green-600 text-white py-3 rounded">
                Proceed to Checkout
              </button> */}
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



