// src/pages/UserProfile.jsx
// import React, { useState } from "react";
// import {
//     UserIcon,
//     EnvelopeIcon,
//     PhoneIcon,
//     MapPinIcon,
//     PencilIcon,
//     ShoppingBagIcon,
//     ArrowRightOnRectangleIcon,
//     KeyIcon,
// } from "@heroicons/react/24/outline";
// import { Form } from "@inertiajs/react";

// const UserProfile = ({ ordersData, userData }) => {
//     const [activeTab, setActiveTab] = useState("profile");
//     const [isEditing, setIsEditing] = useState(false);
//     const token = localStorage.getItem("authToken");
//     console.log("ordersData:", ordersData);

//     const tabs = [
//         { id: "profile", name: "Profile", icon: UserIcon },
//         { id: "orders", name: "Orders", icon: ShoppingBagIcon },
//         { id: "change-password", name: "Change Password", icon: KeyIcon },
//     ];

//     return (
//         <div className="min-h-screen bg-dark1 py-8 ">
//             <div className="max-w-[1200px] mx-auto px-4 xl:px-20">
//                 {/* Header */}
//                 <div className="mb-8">
//                     <h1 className="text-3xl font-bold text-cream">
//                         My Account
//                     </h1>
//                     <p className="text-gray mt-2">
//                         Manage your profile and preferences
//                     </p>
//                 </div>

//                 <div className="flex flex-col md:flex-row bg-dark2 rounded-lg shadow-lg overflow-hidden">
//                     {/* Sidebar Navigation */}
//                     <div className="md:w-1/4 bg-gray/70 p-6">
//                         <div className="flex items-center space-x-4 mb-8">
//                             <img
//                                 className="w-16 h-16 rounded-full object-cover"
//                                 src={userData?.image && `${userData.image}`}
//                                 alt="Profile"
//                             />
//                             <div>
//                                 <h2 className="text-lg font-semibold text-gray-900">
//                                     {userData?.name || "Sirajul Islam"}
//                                 </h2>
//                                 <p className="text-sm text-dark2">
//                                     {userData?.email}
//                                 </p>
//                             </div>
//                         </div>

//                         <nav className="space-y-2">
//                             {tabs.map((tab) => (
//                                 <button
//                                     key={tab.id}
//                                     onClick={() => setActiveTab(tab.id)}
//                                     className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
//                                         activeTab === tab.id
//                                             ? "bg-blue-100 text-blue-700"
//                                             : "text-gray-600 hover:bg-gray-100"
//                                     }`}
//                                 >
//                                     <tab.icon className="w-5 h-5 mr-3" />
//                                     {tab.name}
//                                 </button>
//                             ))}

//                             <button
//                                 onClick={() => {
//                                     localStorage.removeItem("authToken");
//                                     window.location.href = "/";
//                                 }}
//                                 className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
//                             >
//                                 <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
//                                 Sign Out
//                             </button>
//                         </nav>
//                     </div>

//                     {/* Content Area */}
//                     <div className="md:w-3/4 p-6">
//                         {activeTab === "profile" && (
//                             <ProfileTab
//                                 userData={userData}
//                                 isEditing={isEditing}
//                                 setIsEditing={setIsEditing}
//                             />
//                         )}

//                         {activeTab === "orders" && (
//                             <OrdersTab orders={ordersData || []} />
//                         )}

//                         {activeTab === "change-password" && (
//                             <ChangePasswordTab />
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // ==================== Profile Tab ====================
// const ProfileTab = ({ userData, isEditing, setIsEditing }) => {
//     const [formData, setFormData] = useState({
//         name: userData?.name || "",
//         email: userData?.email || "",
//         phone: userData?.phone || "",
//         username: userData?.username || "",
//         address: userData?.address || "",
//         image: userData?.image || "",
//     });
//     const [selectedImage, setSelectedImage] = useState(null);
//     const [updateError, setUpdateError] = useState(null);
//     const [updateSuccess, setUpdateSuccess] = useState(null);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setUpdateError(null);
//         setUpdateSuccess(null);

//         if (!formData.name.trim()) {
//             setUpdateError("Name is required");
//             return;
//         }
//         if (!formData.email.trim()) {
//             setUpdateError("Email is required");
//             return;
//         }
//         if (!/\S+@\S+\.\S+/.test(formData.email)) {
//             setUpdateError("Please enter a valid email address");
//             return;
//         }

//         const userUpdateInfo = new FormData();
//         userUpdateInfo.append("name", formData.name);
//         userUpdateInfo.append("email", formData.email);
//         userUpdateInfo.append("phone", formData.phone);
//         userUpdateInfo.append("username", formData.username);
//         userUpdateInfo.append("address", formData.address);
//         if (selectedImage) {
//             userUpdateInfo.append("image", selectedImage);
//         }

//         try {
//             router.post(route("updateProfile", userUpdateInfo));

//             setUpdateSuccess("Profile updated successfully!");
//             setIsEditing(false);
//         } catch (err) {
//             let errorMessage = "Failed to update profile";

//             setUpdateError(errorMessage);
//         }
//     };

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const handleImageUpload = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setSelectedImage(file);
//             const reader = new FileReader();
//             reader.onload = (event) => {
//                 setFormData({
//                     ...formData,
//                     image: event.target.result,
//                 });
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     return (
//         <div>
//             <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-2xl font-semibold text-cream">
//                     Personal Information
//                 </h2>
//                 {!isEditing && (
//                     <button
//                         onClick={() => setIsEditing(true)}
//                         className="flex items-center px-4 py-2 bg-red text-white rounded-md hover:bg-red/70 transition-colors"
//                     >
//                         <PencilIcon className="w-4 h-4 mr-1" />
//                         Edit Profile
//                     </button>
//                 )}
//             </div>

//             {isEditing ? (
//                 <Form onSubmit={handleSubmit} className="space-y-6">
//                     <div className="flex items-center space-x-6">
//                         <img
//                             className="w-20 h-20 rounded-full object-cover"
//                             src={formData.image}
//                             alt="Profile"
//                         />
//                         <div>
//                             <label className="block text-sm font-medium text-gray">
//                                 Change photo
//                             </label>
//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={handleImageUpload}
//                                 className="mt-1 text-sm text-gray-500"
//                             />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//                         <div>
//                             <label className="block text-sm font-medium text-cream">
//                                 Full Name
//                             </label>
//                             <input
//                                 type="text"
//                                 name="name"
//                                 value={formData.name}
//                                 onChange={handleChange}
//                                 className="mt-1 block w-full rounded-md border text-cream border-gray shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
//                                 required
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray">
//                                 Email
//                             </label>
//                             <input
//                                 type="email"
//                                 name="email"
//                                 value={formData.email}
//                                 onChange={handleChange}
//                                 className="mt-1 block w-full rounded-md border text-cream border-gray shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
//                                 required
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray">
//                                 Phone
//                             </label>
//                             <input
//                                 type="tel"
//                                 name="phone"
//                                 value={formData.phone}
//                                 onChange={handleChange}
//                                 className="mt-1 block w-full rounded-md border border-gray text-cream shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray">
//                                 Username
//                             </label>
//                             <input
//                                 type="text"
//                                 name="username"
//                                 value={formData.username}
//                                 onChange={handleChange}
//                                 className="mt-1 block w-full border rounded-md border-gray text-cream shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
//                             />
//                         </div>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray">
//                             Address
//                         </label>
//                         <textarea
//                             name="address"
//                             value={formData.address}
//                             onChange={handleChange}
//                             rows={3}
//                             className="mt-1 block w-full border rounded-md border-gray text-cream shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
//                         />
//                     </div>

//                     <div className="flex space-x-3">
//                         <button
//                             type="submit"
//                             className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors  `}
//                         >
//                             Save Changes
//                         </button>
//                         <button
//                             type="button"
//                             onClick={() => setIsEditing(false)}
//                             className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 </Form>
//             ) : (
//                 <div className="space-y-6">
//                     <div className="flex items-center space-x-4">
//                         <img
//                             className="w-20 h-20 rounded-full object-cover"
//                             src={userData?.image && `${userData.image}`}
//                             alt="Profile"
//                         />
//                         <div>
//                             <h3 className="text-xl font-semibold text-cream">
//                                 {userData?.name}
//                             </h3>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                         <div className="flex items-center p-4 bg-gray-50 rounded-lg">
//                             <EnvelopeIcon className="w-6 h-6 text-gray-500 mr-3" />
//                             <div>
//                                 <p className="text-sm text-dark2">Email</p>
//                                 <p className="font-medium text-gray-900">
//                                     {userData?.email}
//                                 </p>
//                             </div>
//                         </div>

//                         <div className="flex items-center p-4 bg-gray-50 rounded-lg">
//                             <PhoneIcon className="w-6 h-6 text-cream mr-3" />
//                             <div>
//                                 <p className="text-sm text-gray-600">Phone</p>
//                                 <p className="font-medium text-gray-900">
//                                     {userData?.phone || "N/A"}
//                                 </p>
//                             </div>
//                         </div>

//                         <div className="flex items-center p-4 bg-gray-50 rounded-lg">
//                             <UserIcon className="w-6 h-6 text-gray-500 mr-3" />
//                             <div>
//                                 <p className="text-sm text-gray-600">
//                                     Username
//                                 </p>
//                                 <p className="font-medium text-gray-900">
//                                     {userData?.username || "N/A"}
//                                 </p>
//                             </div>
//                         </div>

//                         <div className="flex items-start p-4 bg-gray-50 rounded-lg sm:col-span-2">
//                             <MapPinIcon className="w-6 h-6 text-gray-500 mr-3 mt-1" />
//                             <div>
//                                 <p className="text-sm text-gray-600">Address</p>
//                                 <p className="font-medium text-gray-900">
//                                     {userData?.address || "N/A"}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// // ==================== Orders Tab (Updated Logic) ====================
// const OrdersTab = ({ orders }) => {
//     console.log("Received ordersData in OrdersTab:", orders);
//     // Safe JSON Parse
//     const safeParse = (str, fallback = {}) => {
//         if (!str) return fallback;
//         try {
//             return JSON.parse(str);
//         } catch (e) {
//             return fallback;
//         }
//     };

//     return (
//         <div>
//             <h2 className="text-2xl font-semibold text-cream mb-6">
//                 Order History
//             </h2>

//             <div className="space-y-4">
//                 {orders &&
//                     orders.map((order) => {
//                         const orderAddress = safeParse(
//                             order.order_address || "{}"
//                         );
//                         const shippingMethod = safeParse(
//                             order.shipping_method || "{}"
//                         );

//                         // If order_address is empty or missing → use pickup point
//                         const usePickup =
//                             !orderAddress.address ||
//                             Object.keys(orderAddress).length === 0;

//                         return (
//                             <div
//                                 key={order.id}
//                                 className="border border-gray/70 rounded-lg p-5 hover:shadow-md transition-shadow"
//                             >
//                                 <div className="flex justify-between items-start mb-4">
//                                     <div>
//                                         <h3 className="font-semibold text-lg text-cream">
//                                             Order #{order.invoice_id}
//                                         </h3>
//                                         <p className="text-sm text-gray">
//                                             Placed on{" "}
//                                             {new Date(
//                                                 order.created_at || Date.now()
//                                             ).toLocaleDateString()}
//                                         </p>
//                                         <p className="text-sm text-cream">
//                                             {order.product_qty} item
//                                             {order.product_qty > 1 ? "s" : ""}
//                                         </p>

//                                         {/* Shipping Method */}
//                                         <p className="text-sm text-cream">
//                                             Shipping:{" "}
//                                             <strong>
//                                                 {usePickup
//                                                     ? "Store Pickup (Free)"
//                                                     : shippingMethod.name ||
//                                                       "Standard Delivery"}
//                                             </strong>
//                                         </p>

//                                         {/* Address or Pickup Point */}
//                                         <p className="text-sm text-cream">
//                                             {usePickup
//                                                 ? "Pickup Store:"
//                                                 : "Deliver to:"}{" "}
//                                             {usePickup ? (
//                                                 <span className="text-green-400 font-medium">
//                                                     {shippingMethod.store_name ||
//                                                         shippingMethod.name ||
//                                                         "Pickup Point"}
//                                                     <br />
//                                                     <span className="text-xs text-gray-200">
//                                                         <strong className="text-cream font-bold ml-1">
//                                                             Address:
//                                                         </strong>
//                                                         {shippingMethod.address}
//                                                     </span>
//                                                     <span className="text-xs text-gray-200">
//                                                         <strong className="text-cream font-bold ml-1">
//                                                             Location:
//                                                         </strong>
//                                                         {
//                                                             shippingMethod.map_location
//                                                         }
//                                                     </span>
//                                                     <span className="text-xs text-gray-200 ">
//                                                         <strong className="text-cream font-bold ml-1">
//                                                             Phone:
//                                                         </strong>
//                                                         {shippingMethod.phone}
//                                                     </span>
//                                                     <span className="text-xs text-gray-200 ">
//                                                         <strong className="text-cream font-bold ml-1">
//                                                             Email:
//                                                         </strong>
//                                                         {shippingMethod.email}
//                                                     </span>
//                                                 </span>
//                                             ) : (
//                                                 <span>
//                                                     {orderAddress.address}
//                                                     {orderAddress.city &&
//                                                         `, ${orderAddress.city}`}
//                                                     {orderAddress.state &&
//                                                         `, ${orderAddress.state}`}
//                                                     {orderAddress.zip &&
//                                                         ` - ${orderAddress.zip}`}
//                                                 </span>
//                                             )}
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <div className="pt-4 border-t border-gray-100">
//                                     <h4 className="text-sm font-semibold text-cream mb-2">
//                                         Products
//                                     </h4>
//                                     {order.order_products.map((product) => {
//                                         const variants = safeParse(
//                                             product.variants || "{}"
//                                         );

//                                         return (
//                                             <div
//                                                 key={product.id}
//                                                 className="flex items-center space-x-4 mb-4"
//                                             >
//                                                 <img
//                                                     src={
//                                                         product.front_image
//                                                             ? `/${product.front_image}`
//                                                             : product.back_image
//                                                             ? `/${product.back_image}`
//                                                             : variants.image
//                                                             ? `/${variants.image}`
//                                                             : "https://via.placeholder.com/100"
//                                                     }
//                                                     alt={product.product_name}
//                                                     className="w-16 h-16 object-cover rounded"
//                                                 />
//                                                 <div className="flex-1">
//                                                     <p className="text-cream font-medium">
//                                                         {product.product_name}
//                                                     </p>
//                                                     <p className="text-sm text-gray">
//                                                         Quantity: {product.qty}
//                                                     </p>
//                                                     <p className="text-sm text-gray">
//                                                         Unit Price: $
//                                                         {product.unit_price}
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         );
//                                     })}
//                                 </div>

//                                 <div className="flex justify-between items-center pt-4 border-t border-gray-100">
//                                     <span className="text-cream font-semibold">
//                                         Total: ${order.amount}
//                                     </span>
//                                 </div>
//                             </div>
//                         );
//                     })}
//             </div>
//         </div>
//     );
// };

// // ==================== Change Password Tab ====================
// const ChangePasswordTab = () => {
//     const [formData, setFormData] = useState({
//         current_password: "",
//         new_password: "",
//         new_password_confirmation: "",
//     });
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(null);

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//         setError(null);
//         setSuccess(null);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(null);
//         setSuccess(null);

//         if (!formData.current_password) {
//             setError("Current password is required");
//             return;
//         }
//         if (formData.new_password.length < 6) {
//             setError("New password must be at least 6 characters");
//             return;
//         }
//         if (formData.new_password !== formData.new_password_confirmation) {
//             setError("New password and confirmation do not match");
//             return;
//         }

//         try {
//             setSuccess("Password changed successfully!");
//             setFormData({
//                 current_password: "",
//                 new_password: "",
//                 new_password_confirmation: "",
//             });
//         } catch (err) {
//             let errorMessage = "Failed to change password";

//             setError(errorMessage);
//         }
//     };

//     return (
//         <div>
//             <h2 className="text-2xl font-semibold text-cream mb-6">
//                 Change Password
//             </h2>

//             {error && (
//                 <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
//                     {error}
//                 </div>
//             )}
//             {success && (
//                 <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
//                     {success}
//                 </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
//                 <div>
//                     <label className="block text-sm font-medium text-cream">
//                         Current Password
//                     </label>
//                     <input
//                         type="password"
//                         name="current_password"
//                         value={formData.current_password}
//                         onChange={handleChange}
//                         className="mt-1 block w-full rounded-md border border-gray text-cream bg-dark2 p-2 focus:border-blue-500 focus:ring-blue-500"
//                         required
//                     />
//                 </div>

//                 <div>
//                     <label className="block text-sm font-medium text-cream">
//                         New Password
//                     </label>
//                     <input
//                         type="password"
//                         name="new_password"
//                         value={formData.new_password}
//                         onChange={handleChange}
//                         className="mt-1 block w-full rounded-md border border-gray text-cream bg-dark2 p-2 focus:border-blue-500 focus:ring-blue-500"
//                         required
//                     />
//                 </div>

//                 <div>
//                     <label className="block text-sm font-medium text-cream">
//                         Confirm New Password
//                     </label>
//                     <input
//                         type="password"
//                         name="new_password_confirmation"
//                         value={formData.new_password_confirmation}
//                         onChange={handleChange}
//                         className="mt-1 block w-full rounded-md border border-gray text-cream bg-dark2 p-2 focus:border-blue-500 focus:ring-blue-500"
//                         required
//                     />
//                 </div>

//                 <button
//                     type="submit"
//                     disabled={isLoading}
//                     className={`w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors ${
//                         isLoading ? "opacity-50 cursor-not-allowed" : ""
//                     }`}
//                 >
//                     {isLoading ? "Changing..." : "Change Password"}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default UserProfile;


// resources/js/Pages/UserProfile.jsx
import React, { useState } from "react";
import {
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    PencilIcon,
    ShoppingBagIcon,
    ArrowRightOnRectangleIcon,
    KeyIcon,
} from "@heroicons/react/24/outline";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { toast } from "react-toastify";

const UserProfile = ({ ordersData, userData, totalOrder = 0 }) => {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);

    // Profile Form
    const { data: profileData, setData: setProfileData, post: postProfile, processing: profileProcessing, errors: profileErrors, reset: resetProfile } = useForm({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        username: userData.username || "",
        address: userData.address || "",
        image: null,
        _method: "put",
    });

    // Password Form
    const { data: passwordData, setData: setPasswordData, post: postPassword, processing: passwordProcessing, errors: passwordErrors, reset: resetPassword } = useForm({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
        _method: "put",
    });

    const [imagePreview, setImagePreview] = useState(userData.image || null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileData("image", file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const submitProfile = (e) => {
        e.preventDefault();
        postProfile(route("update.profile"), {
            forceFormData: true, // Required for file upload
            onSuccess: () => {
                toast.success("Profile updated successfully");
                setIsEditing(false);
                resetProfile("image");
            },
        });
    };

    const submitPassword = (e) => {
        e.preventDefault();
        postPassword(route("update.password"), {
            onSuccess: () => {
                toast.success("Password changed successfully");
                resetPassword();
            },
        });
    };

    const handleLogout = () => {
        router.post(route("customer.logout"),{
            onSuccess: () => {
               toast.info("Logged out successfully");
            }
        });
    };

    const safeParse = (str, fallback = {}) => {
        if (!str) return fallback;
        try {
            return JSON.parse(str);
        } catch (e) {
            return fallback;
        }
    };

    return (
        <>
            <Head title="My Account" />

            <div className="min-h-screen bg-dark1 py-8">
                <div className="max-w-[1200px] mx-auto px-4 xl:px-20">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-cream">My Account</h1>
                        <p className="text-gray mt-2">Manage your profile and preferences</p>
                    </div>

                    {/* Flash Message */}
                    {flash?.message && (
                        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
                            {flash.message}
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row bg-dark2 rounded-lg shadow-lg overflow-hidden">
                        {/* Sidebar */}
                        <div className="md:w-1/4 bg-gray/70 p-6">
                            <div className="flex items-center space-x-4 mb-8">
                                <img
                                    className="w-16 h-16 rounded-full object-cover"
                                    src={ "../../../uploads/default.jpg"}
                                    alt="Profile"
                                />
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">{userData.name}</h2>
                                    <p className="text-sm text-dark2">{userData.email}</p>
                                </div>
                            </div>

                            <nav className="space-y-2">
                                {[
                                    { id: "profile", name: "Profile", icon: UserIcon },
                                    { id: "orders", name: `Orders (${totalOrder})`, icon: ShoppingBagIcon },
                                    { id: "change-password", name: "Change Password", icon: KeyIcon },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                            activeTab === tab.id
                                                ? "bg-blue-100 text-blue-700"
                                                : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                    >
                                        <tab.icon className="w-5 h-5 mr-3" />
                                        {tab.name}
                                    </button>
                                ))}

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                                    Sign Out
                                </button>
                            </nav>
                        </div>

                        {/* Content Area */}
                        <div className="md:w-3/4 p-6">
                            {activeTab === "profile" && (
                                <ProfileTab
                                    userData={userData}
                                    isEditing={isEditing}
                                    setIsEditing={setIsEditing}
                                    profileData={profileData}
                                    setProfileData={setProfileData}
                                    imagePreview={imagePreview}
                                    handleImageChange={handleImageChange}
                                    submitProfile={submitProfile}
                                    profileProcessing={profileProcessing}
                                    profileErrors={profileErrors}
                                />
                            )}

                            {activeTab === "orders" && <OrdersTab orders={ordersData || []} safeParse={safeParse} />}

                            {activeTab === "change-password" && (
                                <ChangePasswordTab
                                    passwordData={passwordData}
                                    setPasswordData={setPasswordData}
                                    submitPassword={submitPassword}
                                    passwordProcessing={passwordProcessing}
                                    passwordErrors={passwordErrors}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// ==================== Profile Tab ====================
const ProfileTab = ({
    userData,
    isEditing,
    setIsEditing,
    profileData,
    setProfileData,
    imagePreview,
    handleImageChange,
    submitProfile,
    profileProcessing,
    profileErrors,
}) => {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-cream">Personal Information</h2>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center px-4 py-2 bg-red text-white rounded-md hover:bg-red/70 transition-colors"
                    >
                        <PencilIcon className="w-4 h-4 mr-1" />
                        Edit Profile
                    </button>
                )}
            </div>

            {isEditing ? (
                <form onSubmit={submitProfile} className="space-y-6">
                    <div className="flex items-center space-x-6">
                        <img
                            className="w-20 h-20 rounded-full object-cover"
                            src={imagePreview ||  "../../../uploads/default.jpg"}
                            alt="Profile"
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray">Change photo</label>
                            <input type="file" accept="image/*" onChange={handleImageChange} className="mt-1 text-sm" />
                            {profileErrors.image && <p className="text-red-500 text-sm">{profileErrors.image}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-cream">Full Name</label>
                            <input
                                type="text"
                                value={profileData.name}
                                onChange={(e) => setProfileData("name", e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray text-cream bg-dark2 p-2"
                            />
                            {profileErrors.name && <p className="text-red-500 text-sm">{profileErrors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-cream">Email</label>
                            <input
                                type="email"
                                value={profileData.email}
                                onChange={(e) => setProfileData("email", e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray text-cream bg-dark2 p-2"
                            />
                            {profileErrors.email && <p className="text-red-500 text-sm">{profileErrors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-cream">Phone</label>
                            <input
                                type="tel"
                                value={profileData.phone}
                                onChange={(e) => setProfileData("phone", e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray text-cream bg-dark2 p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-cream">Username</label>
                            <input
                                type="text"
                                value={profileData.username}
                                onChange={(e) => setProfileData("username", e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray text-cream bg-dark2 p-2"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-cream">Address</label>
                        <textarea
                            rows={3}
                            value={profileData.address}
                            onChange={(e) => setProfileData("address", e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray text-cream bg-dark2 p-2"
                        />
                    </div>

                    <div className="flex space-x-3">
                        <button
                            type="submit"
                            disabled={profileProcessing}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {profileProcessing ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <img
                            className="w-20 h-20 rounded-full object-cover"
                            src={"../../../uploads/default.jpg"}
                            alt="Profile"
                        />
                        <h3 className="text-xl font-semibold text-cream">{userData.name}</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                            <EnvelopeIcon className="w-6 h-6 text-gray-500 mr-3" />
                            <div>
                                <p className="text-sm text-dark2">Email</p>
                                <p className="font-medium text-gray-900">{userData.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                            <PhoneIcon className="w-6 h-6 text-cream mr-3" />
                            <div>
                                <p className="text-sm text-gray-600">Phone</p>
                                <p className="font-medium text-gray-900">{userData.phone || "N/A"}</p>
                            </div>
                        </div>
                        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                            <UserIcon className="w-6 h-6 text-gray-500 mr-3" />
                            <div>
                                <p className="text-sm text-gray-600">Username</p>
                                <p className="font-medium text-gray-900">{userData.username || "N/A"}</p>
                            </div>
                        </div>
                        <div className="flex items-start p-4 bg-gray-50 rounded-lg sm:col-span-2">
                            <MapPinIcon className="w-6 h-6 text-gray-500 mr-3 mt-1" />
                            <div>
                                <p className="text-sm text-gray-600">Address</p>
                                <p className="font-medium text-gray-900">{userData.address || "N/A"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ==================== Orders Tab ====================
const OrdersTab = ({ orders, safeParse }) => {
    return (
        <div>
            <h2 className="text-2xl font-semibold text-cream mb-6">Order History</h2>

            {orders.length === 0 ? (
                <p className="text-cream text-center py-8">No orders found.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => {
                        const orderAddress = safeParse(order.order_address || "{}");
                        const shippingMethod = safeParse(order.shipping_method || "{}");
                        const usePickup = !orderAddress.address || Object.keys(orderAddress).length === 0;

                        return (
                            <div key={order.id} className="border border-gray/70 rounded-lg p-5 hover:shadow-md transition-shadow">
                                <div className="mb-4">
                                    <h3 className="font-semibold text-lg text-cream">Order #{order.invoice_id}</h3>
                                    <p className="text-sm text-gray">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                                    <p className="text-sm text-cream">{order.product_qty} item{order.product_qty > 1 ? "s" : ""}</p>
                                    <p className="text-sm text-cream">
                                        Shipping: <strong>{usePickup ? "Store Pickup (Free)" : shippingMethod.name || "Standard Delivery"}</strong>
                                    </p>
                                    <p className="text-sm text-cream">
                                        {usePickup ? "Pickup Store:" : "Deliver to:"}{" "}
                                        {usePickup ? shippingMethod.store_name || "Pickup Point" : orderAddress.address}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <h4 className="text-sm font-semibold text-cream mb-2">Products</h4>
                                    {order.order_products.map((product) => {
                                        const variants = safeParse(product.variants || "{}");
                                        return (
                                            <div key={product.id} className="flex items-center space-x-4 mb-4">
                                                <img
                                                    src={
                                                        product.front_image ? `/${product.front_image}` :
                                                        product.back_image ? `/${product.back_image}` :
                                                        variants.image ? `/${variants.image}` :
                                                        "https://via.placeholder.com/100"
                                                    }
                                                    alt={product.product_name}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-cream font-medium">{product.product_name}</p>
                                                    <p className="text-sm text-gray">Qty: {product.qty}</p>
                                                    <p className="text-sm text-gray">Price: ${product.unit_price}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="pt-4 border-t border-gray-100 text-right">
                                    <span className="text-cream font-semibold">Total: ${order.amount}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// ==================== Change Password Tab ====================
const ChangePasswordTab = ({
    passwordData,
    setPasswordData,
    submitPassword,
    passwordProcessing,
    passwordErrors,
}) => {
    return (
        <div>
            <h2 className="text-2xl font-semibold text-cream mb-6">Change Password</h2>

            <form onSubmit={submitPassword} className="space-y-6 max-w-md">
                <div>
                    <label className="block text-sm font-medium text-cream">Current Password</label>
                    <input
                        type="password"
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData("current_password", e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray text-cream bg-dark2 p-2"
                        required
                    />
                    {passwordErrors.current_password && <p className="text-red-500 text-sm mt-1">{passwordErrors.current_password}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-cream">New Password</label>
                    <input
                        type="password"
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData("new_password", e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray text-cream bg-dark2 p-2"
                        required
                    />
                    {passwordErrors.new_password && <p className="text-red-500 text-sm mt-1">{passwordErrors.new_password}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-cream">Confirm New Password</label>
                    <input
                        type="password"
                        value={passwordData.new_password_confirmation}
                        onChange={(e) => setPasswordData("new_password_confirmation", e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray text-cream bg-dark2 p-2"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={passwordProcessing}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {passwordProcessing ? "Changing..." : "Change Password"}
                </button>
            </form>
        </div>
    );
};

export default UserProfile;
