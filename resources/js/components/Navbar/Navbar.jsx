import React, { useState, useRef, useEffect } from "react";


import { IoSearchSharp } from "react-icons/io5";
import { FaChevronDown, FaBars } from "react-icons/fa6";
import { GrBasket } from "react-icons/gr";
import { Link, router, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import { useCartStore } from '../../stores/cartStore';

const Navbar = () => {
    const { categoriess, logos } = usePage().props;
    // console.log(categoriess);
    // const cartCount = useCartStore((s) => s.cartCount);
    const { auth } = usePage().props;
    const cartCount = useCartStore((state) => state.cartCount);

// console.log('cart', cartCount);

    const customer = auth?.user;
    const logoPath = logos?.logo || logos?.favicon;
    // console.log(cartCount);
    // const dispatch = useDispatch();
    // const navigate = useNavigate();
    const mobileMenuRef = useRef(null);
    const [isSticky, setSticky] = useState(false);
    const [showSearchbar, setShowSearchbar] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [mobileShopOpen, setMobileShopOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [hoveredCat, setHoveredCat] = useState(null);
    const [hoveredSub, setHoveredSub] = useState(null);

    const searchBarRef = useRef(null);
    const navRef = useRef(null);

    // const token = useSyncToken();

    // const categories = categoryData?.categories || [];
    // const totalQuantity = cart?.data?.cart_count ?? 0;

    useEffect(() => {
        const handleScroll = () => setSticky(window.scrollY > 250);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                searchBarRef.current &&
                !searchBarRef.current.contains(e.target)
            ) {
                setShowSearchbar(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    useEffect(() => {
        const handleClickOutsideMobileMenu = (event) => {
            if (
                showMobileMenu &&
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target)
            ) {
                setShowMobileMenu(false);
                setMobileShopOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutsideMobileMenu);
        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutsideMobileMenu
            );
        };
    }, [showMobileMenu]);

    const toggleSearch = () => setShowSearchbar(!showSearchbar);
    const toggleProfileDropdown = () =>
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);

    const handleLogout = async (e) => {
        
        e.preventDefault(); // Important: prevent any default button behavior
        e.stopPropagation();
    router.post(
        route('customer.logout'), // ← Use the correct route name (usually 'logout')
        {}, // ← Empty data object (required)
        {
            onSuccess: () => {
                router.visit(route('home'));
            },
            onError: (errors) => {
                console.error('Logout failed', errors);
            },
            onFinish: () => {
                // Optional: close dropdown
                setIsProfileDropdownOpen(false);
            }
        }
    );
    };
     const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        router.get(route('all.products'), { q: searchQuery }, {
            preserveState: true,
            preserveScroll: true,
        });
        setShowSearchbar(false);
        setSearchQuery("");
    };

    // এই ফাংশনটাই ম্যাজিক! ID দিয়ে Shop Page এ পাঠাবে
    // const goToShopWithCategory = (categoryId) => {
    //     navigate(`/shop/?category_ids[]=${categoryId}`);
    //     setShowMobileMenu(false);
    //     setMobileShopOpen(false);
    //     setHoveredCat(null);
    //     setHoveredSub(null);
    // };
    const goToShopWithCategory = (categoryId = null) => {
    router.get(route('all.products'), {
        category_ids: categoryId ? [categoryId] : [],
          
    }, {
        preserveState: true,
        preserveScroll: true,
    });

    // মোবাইল মেনু বন্ধ করা
    setShowMobileMenu(false);
    setMobileShopOpen(false);
    setHoveredCat(null);
    setHoveredSub(null);
};

    // সাবক্যাটাগরি + চাইল্ডের জন্যও ID দিয়ে পাঠাবে
    const goToShopWithSubcategory = (subId) => {
        // navigate(`/shop/?category_ids[]=${subId}`);
        // setShowMobileMenu(false);
        // setMobileShopOpen(false);
        router.get(route('all.products'), {
        category_ids: subId ? [subId] : [],
    }, {
        preserveState: true,
        preserveScroll: true,
    });

    // মোবাইল মেনু বন্ধ করা
    setShowMobileMenu(false);
    setMobileShopOpen(false);
    setHoveredCat(null);
    setHoveredSub(null);
    };
    return (
        <div ref={navRef}>
            {/* Main Navbar  */}

            <div
                className={` bg-dark2  transition-all duration-500 ${isSticky
                        ? "fixed top-0 left-0 right-0 z-50 py-4 shadow-md"
                        : "py-6 lg:py-4"
                    }`}
            >
                <div className="px-4 sm:px-6 lg:px-10 xl:px-20 max-w-[1200px] mx-auto flex justify-between items-center">
                    <div
                        className="block lg:hidden cursor-pointer"
                        onClick={toggleMobileMenu}
                    >
                        <FaBars className="text-cream text-xl" />
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6 lg:gap-10">
                        {/* {logos?.logo?.favicon && ( */}
                            <Link href={route("home")}>
                                <img
                                    src={`/${logoPath}`}
                                    alt="logo"
                                    className={`w-8 sm:w-10 lg:w-12 ${
                                        isSticky ? "w-8" : ""
                                    }`}
                                />
                            </Link>
                        {/* )} */}
                   

                        <nav className="hidden lg:flex">
                            <ul className="flex gap-6 xl:gap-8 items-center">
                                {/* SHOP Dropdown */}
                                <li className="relative group">
                                    <Link
                                        href={route("all.products")}
                                        className="px-4 py-2 text-cream hover:bg-nav-gradient rounded-[10px] font-mont cursor-pointer flex items-center  text-md  uppercase"
                                    >
                                        Our Products
                                        <FaChevronDown className="ml-2 text-sm transition-transform group-hover:rotate-180" />
                                    </Link>

                                    <div className="absolute top-full left-0 bg-cream w-[250px] p-4 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                        <ul>

                                            {categoriess.map((cat) => (
                                                <li
                                                    key={cat.id}
                                                    className="relative group/sub font-mont"
                                                    onMouseEnter={() =>
                                                        setHoveredCat(cat.id)
                                                    }
                                                    onMouseLeave={() => {
                                                        setHoveredCat(null);
                                                        setHoveredSub(null);
                                                    }}
                                                >
                                                    <div
                                                        className="flex items-center justify-between py-2 px-3 cursor-pointer hover:bg-gray-100 rounded"
                                                        onClick={() =>
                                                            goToShopWithCategory(
                                                                cat.id
                                                            )
                                                        }
                                                    >
                                                        <span className="text-dark2 text-sm font-mont">
                                                            {cat.name}
                                                        </span>
                                                        {cat.sub_categories
                                                            ?.length > 0 && (
                                                                <span className="text-xs">
                                                                    ›
                                                                </span>
                                                            )}
                                                    </div>

                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </li>

                                {["ABOUT", "CONTACT", "CUSTOMIZE"].map(
                                    (title) => (
                                        <li key={title}>
                                            <Link
                                            
                                                // href={`/${title.toLowerCase()}`}
                                                href={route(`${title.toLowerCase()}`)} 
                                                className="px-4 py-2 text-cream hover:bg-nav-gradient font-mont rounded-[10px] text-md hover:text-red"
                                            >
                                                {title}
                                            </Link>
                                        </li>
                                    )
                                )}
                            </ul>
                        </nav>
                    </div>

                    {/* <ul className="flex items-center gap-4 sm:gap-6">
                        <li
                            className="text-cream cursor-pointer"
                            onClick={toggleSearch}
                        >
                            <IoSearchSharp className="text-xl" />
                        </li>

                        <li className="relative">
                            <div
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={toggleProfileDropdown}
                            >
                                <img
                                    src={`${customer?.image ?? ''}`}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full object-cover border border-cream"
                                />
                                <span className="text-cream text-md hidden sm:block font-mont">
                                    {customer?.name ?? ''}
                                </span>
                            </div>

                            <ul className="absolute top-[120%] right-0 bg-cream w-[150px] p-4 rounded-lg shadow-lg z-30">
                                <li>
                                    <Link
                                        href="/profile"
                                        className="block px-2 py-2 text-dark2 text-sm hover:bg-linear-to-r from-dark1 to-dark2 font-mont hover:text-cream rounded"
                                        onClick={() =>
                                            setIsProfileDropdownOpen(
                                                false
                                            )
                                        }
                                    >
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        type="button"
                                        className="block w-full text-left px-2 py-2 text-dark2 font-mont text-sm hover:bg-linear-to-r from-dark1 to-dark2 hover:text-cream rounded"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </ul>

                        </li>

                        <li className="text-cream text-md hidden lg:block font-mont">
                            <Link href={route('customer.login')}>SIGN IN</Link>
                        </li>

                        <li className="text-cream relative">
                            <Link href="/cart">
                                <GrBasket size={35} />
                                {cartCount > 0 && (
                                    <div className="absolute -top-2 font-mont -right-2 w-5 h-5 rounded-full bg-red text-cream flex justify-center items-center text-xs">
                                        {cartCount}
                                    </div>
                                )}
                            </Link>
                        </li>
                    </ul> */}
                    <ul className="flex items-center gap-4 sm:gap-6">
    <li
        className="text-cream cursor-pointer"
        onClick={toggleSearch}
    >
        <IoSearchSharp className="text-xl" />
    </li>

    {/* Conditional: Logged in user → Profile Dropdown | Guest → SIGN IN */}
    {customer ? (
        <li className="relative">
            <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={toggleProfileDropdown}
            >
                <img
                    src={'../../../../uploads/default.jpg'} // fallback image if no image
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border border-cream"
                />
                <span className="text-cream text-md hidden sm:block font-mont">
                    {customer?.name || 'User'}
                </span>
            </div>

            {/* Dropdown - only show when open */}
            {isProfileDropdownOpen && (
                <ul className="absolute top-[120%] right-0 bg-cream w-[150px] p-4 rounded-lg shadow-lg z-30 transition-all duration-200">
                    <li>
                        <Link
                            href={route('user.profile')}
                            className="block px-2 py-2 text-dark2 text-sm hover:bg-linear-to-r from-dark1 to-dark2 font-mont hover:text-cream rounded"
                            onClick={() => setIsProfileDropdownOpen(false)}
                        >
                            Profile
                        </Link>
                    </li>
                    <li>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="block w-full text-left px-2 py-2 text-dark2 font-mont text-sm hover:bg-linear-to-r from-dark1 to-dark2 hover:text-cream rounded"
                        >
                            Logout
                        </button>
                    </li>
                </ul>
            )}
        </li>
    ) : (
        <li className="text-cream text-md hidden lg:block font-mont">
            <Link href={route('customer.login')}>SIGN IN</Link>
        </li>
    )}

    <li className="text-cream relative">
        <Link href="/cart">
            <GrBasket size={35} />
            {/* {cartCount > 0 && ( */}
                <div className="absolute -top-2 font-mont -right-2 w-5 h-5 rounded-full bg-red text-cream flex justify-center items-center text-xs">
                    {cartCount}
                </div>
            {/* )} */}
        </Link>
    </li>
</ul>
                </div>

                {/* Mobile Menu */}
                {showMobileMenu && (
                    <div
                        ref={mobileMenuRef}
                        className={`lg:hidden fixed ${isSticky ? "top-14" : "top-[72px]"
                            } left-0 right-0 bg-dark2 shadow-lg z-40 max-h-[80vh] overflow-y-auto`}
                    >
                         <ul className="px-4 py-4 space-y-2">
                            <li>
                                <div
                                    className="flex items-center font-mont justify-between text-cream py-3 px-4 rounded-lg hover:bg-nav-gradient cursor-pointer"
                                     onClick={() => {
                                        setMobileShopOpen(!mobileShopOpen);
                                            router.get(route('all.products'));
                                        setShowMobileMenu(false);
                                        setMobileShopOpen(false);
                                    }}
                                   
                                >
                                    <span     >OUR PRODUCTS</span>
                                    <FaChevronDown
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setMobileShopOpen(!mobileShopOpen);
                                        }}
                                        className={`transition-transform ${
                                            mobileShopOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </div>
                                {mobileShopOpen && categoriess && (
                                    <ul className="bg-cream/10 ml-4 mt-2 rounded-lg space-y-1">
                                        {categoriess.map((cat) => (
                                            <li key={cat.id}>
                                                <div
                                                    className="text-cream py-2 px-4 hover:bg-cream/20 cursor-pointer"
                                                    onClick={() =>
                                                        goToShopWithCategory(
                                                            cat.id
                                                        )
                                                    }
                                                >
                                                    {cat.name}
                                                </div>
                                                {cat.sub_categories?.length >
                                                    0 && (
                                                    <ul className="ml-4 mt-1">
                                                        {cat.sub_categories.map(
                                                            (sub) => (
                                                                <li
                                                                    key={sub.id}
                                                                >
                                                                    <div
                                                                        className="text-cream  font-mont py-2 px-4 hover:bg-cream/20 cursor-pointer text-sm"
                                                                        onClick={() =>
                                                                            goToShopWithSubcategory(
                                                                                sub.id
                                                                            )
                                                                        }
                                                                    >
                                                                        {
                                                                            sub.name
                                                                        }
                                                                    </div>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>

                            {["ABOUT", "CONTACT", "CUSTOMIZE"].map((title) => (
                                <li key={title}>
                                    <Link
                                        href={`/${title.toLowerCase()}`}
                                        className="block text-cream font-mont py-3 px-4 rounded-lg hover:bg-nav-gradient"
                                        onClick={toggleMobileMenu}
                                    >
                                        {title}
                                    </Link>
                                </li>
                            ))}

                            {!customer && (
                                <li>
                                    <Link
                                        href={route("customer.login")}
                                        className="block text-cream py-3 px-4 font-mont rounded-lg hover:bg-nav-gradient"
                                        onClick={toggleMobileMenu}
                                    >
                                        SIGN IN
                                    </Link>
                                </li>
                            )}
                        </ul> 
                    </div>
                )}

                {/* Search Overlay */}
                <div
                    ref={searchBarRef}
                    className={`fixed inset-x-0 px-4 sm:px-6 lg:px-20 py-6 bg-dark2 transition-all duration-500 z-50 ${showSearchbar
                            ? "top-0 opacity-100"
                            : "-top-full opacity-0"
                        }`}
                >
                     <div className="flex justify-between items-center mb-4">
                        <h4 className="text-cream text-lg font-mont">
                            Search Our Product
                        </h4>
                        <button
                            onClick={toggleSearch}
                            className="text-cream text-2xl"
                        >
                            ×
                        </button>
                    </div>
                    <form onSubmit={handleSearchSubmit}>
                        <div className="border-b border-gray flex items-center">
                            <input
                                type="text"
                                placeholder="Are You Looking For?"
                                className="py-2 w-full bg-dark2 text-cream placeholder:text-gray focus:outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit">
                                <IoSearchSharp className="text-gray text-xl" />
                            </button>
                        </div>
                    </form> 
                </div>
            </div>
        </div>
    );
};


export default Navbar

// import React, { useState, useRef, useEffect } from "react";

// import { IoSearchSharp } from "react-icons/io5";
// import { FaChevronDown, FaBars } from "react-icons/fa6";
// import { GrBasket } from "react-icons/gr";
// import { Link, router, usePage } from "@inertiajs/react";
// import { route } from "ziggy-js";
// import { useCartStore } from '../../stores/cartStore';

// const Navbar = () => {
//     const { props } = usePage();
//     const { categoriess, logos, auth } = props;
//     const customer = auth?.user;
//     const logoPath = logos?.logo || logos?.favicon;
//     const cartCount = useCartStore((state) => state.cartCount);

//     const mobileMenuRef = useRef(null);
//     const searchBarRef = useRef(null);
//     const navRef = useRef(null);

//     const [isSticky, setSticky] = useState(false);
//     const [showSearchbar, setShowSearchbar] = useState(false);
//     const [showMobileMenu, setShowMobileMenu] = useState(false);
//     const [mobileShopOpen, setMobileShopOpen] = useState(false);
//     const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
//     const [searchQuery, setSearchQuery] = useState("");

//     const [hoveredCat, setHoveredCat] = useState(null);
//     const [hoveredSub, setHoveredSub] = useState(null);

//     useEffect(() => {
//         const handleScroll = () => setSticky(window.scrollY > 250);
//         window.addEventListener("scroll", handleScroll);
//         return () => window.removeEventListener("scroll", handleScroll);
//     }, []);

//     useEffect(() => {
//         const handleClickOutside = (e) => {
//             if (searchBarRef.current && !searchBarRef.current.contains(e.target)) {
//                 setShowSearchbar(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     useEffect(() => {
//         const handleClickOutsideMobileMenu = (event) => {
//             if (showMobileMenu && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
//                 setShowMobileMenu(false);
//                 setMobileShopOpen(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutsideMobileMenu);
//         return () => document.removeEventListener("mousedown", handleClickOutsideMobileMenu);
//     }, [showMobileMenu]);

//     const toggleSearch = () => setShowSearchbar(!showSearchbar);
//     const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);
//     const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);

//     const handleLogout = (e) => {
//         e.preventDefault();
//         router.post(route('customer.logout'), {}, {
//             onSuccess: () => router.visit(route('home')),
//             onFinish: () => setIsProfileDropdownOpen(false),
//         });
//     };

//     const handleSearchSubmit = (e) => {
//         e.preventDefault();
//         if (!searchQuery.trim()) return;

//         router.get(route('all.products'), { search: searchQuery }, {
//             preserveState: true,
//             preserveScroll: true,
//         });
//         setShowSearchbar(false);
//         setSearchQuery("");
//     };

//     // একটাই ফাংশন – ক্যাটাগরি ক্লিকে all.products পেজে যাবে
//     const goToCategory = (categoryId = null) => {
//         router.get(route('all.products'), {
//             category_ids: categoryId ? [categoryId] : [],
//         }, {
//             preserveState: true,
//             preserveScroll: true,
//         });

//         setShowMobileMenu(false);
//         setMobileShopOpen(false);
//         setHoveredCat(null);
//         setHoveredSub(null);
//     };

//     return (
//         <div ref={navRef}>
//             <div className={`bg-dark2 transition-all duration-500 ${isSticky ? "fixed top-0 left-0 right-0 z-50 py-4 shadow-md" : "py-6 lg:py-4"}`}>
//                 <div className="px-4 sm:px-6 lg:px-10 xl:px-20 max-w-[1200px] mx-auto flex justify-between items-center">
//                     {/* Mobile Menu Toggle */}
//                     <div className="block lg:hidden cursor-pointer" onClick={toggleMobileMenu}>
//                         <FaBars className="text-cream text-xl" />
//                     </div>

//                     {/* Logo + Desktop Nav */}
//                     <div className="flex items-center gap-4 sm:gap-6 lg:gap-10">
//                         <Link href={route("home")}>
//                             <img
//                                 src={`/${logoPath}`}
//                                 alt="logo"
//                                 className={`w-8 sm:w-10 lg:w-12 ${isSticky ? "w-8" : ""}`}
//                             />
//                         </Link>

//                         {/* Desktop Navigation */}
//                         <nav className="hidden lg:flex">
//                             <ul className="flex gap-6 xl:gap-8 items-center">
//                                 {/* OUR PRODUCTS Dropdown */}
//                                 <li className="relative group">
//                                     <div className="px-4 py-2 text-cream hover:bg-nav-gradient rounded-[10px] font-mont cursor-pointer flex items-center text-md uppercase">
//                                         Our Products
//                                         <FaChevronDown className="ml-2 text-sm transition-transform group-hover:rotate-180" />
//                                     </div>

//                                     <div className="absolute top-full left-0 bg-cream w-[250px] p-4 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
//                                         <ul>
//                                             {/* All Products */}
//                                             <li>
//                                                 <div
//                                                     onClick={() => goToCategory()}
//                                                     className="py-2 px-3 cursor-pointer hover:bg-gray-100 rounded text-dark2 font-mont"
//                                                 >
//                                                     All Products
//                                                 </div>
//                                             </li>

//                                             {categoriess?.map((cat) => (
//                                                 <li
//                                                     key={cat.id}
//                                                     className="relative group/sub font-mont"
//                                                     onMouseEnter={() => setHoveredCat(cat.id)}
//                                                     onMouseLeave={() => {
//                                                         setHoveredCat(null);
//                                                         setHoveredSub(null);
//                                                     }}
//                                                 >
//                                                     <div
//                                                         onClick={() => goToCategory(cat.id)}
//                                                         className="flex items-center justify-between py-2 px-3 cursor-pointer hover:bg-gray-100 rounded"
//                                                     >
//                                                         <span className="text-dark2 text-sm font-mont">{cat.name}</span>
//                                                         {cat.sub_categories?.length > 0 && <span className="text-xs">›</span>}
//                                                     </div>

//                                                     {/* Subcategory hover dropdown (optional) */}
//                                                     {cat.sub_categories?.length > 0 && hoveredCat === cat.id && (
//                                                         <ul className="absolute left-full top-0 bg-cream w-[200px] p-3 rounded-lg shadow-lg">
//                                                             {cat.sub_categories.map((sub) => (
//                                                                 <li key={sub.id}>
//                                                                     <div
//                                                                         onClick={(e) => {
//                                                                             e.stopPropagation();
//                                                                             goToCategory(sub.id);
//                                                                         }}
//                                                                         className="py-2 px-3 text-dark2 text-sm hover:bg-gray-100 rounded cursor-pointer"
//                                                                     >
//                                                                         {sub.name}
//                                                                     </div>
//                                                                 </li>
//                                                             ))}
//                                                         </ul>
//                                                     )}
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     </div>
//                                 </li>

//                                 {/* Static Pages */}
//                                 {["about", "contact", "customize"].map((page) => (
//                                     <li key={page}>
//                                         <Link
//                                             href={route(page)}
//                                             className="px-4 py-2 text-cream hover:bg-nav-gradient font-mont rounded-[10px] text-md hover:text-red uppercase"
//                                         >
//                                             {page.charAt(0).toUpperCase() + page.slice(1)}
//                                         </Link>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </nav>
//                     </div>

//                     {/* Right Side Icons */}
//                     <ul className="flex items-center gap-4 sm:gap-6">
//                         <li className="text-cream cursor-pointer" onClick={toggleSearch}>
//                             <IoSearchSharp className="text-xl" />
//                         </li>

//                         {customer ? (
//                             <li className="relative">
//                                 <div className="flex items-center gap-2 cursor-pointer" onClick={toggleProfileDropdown}>
//                                     <img
//                                         src={customer?.image ? `/${customer.image}` : '/images/default-avatar.jpg'}
//                                         alt="Profile"
//                                         className="w-8 h-8 rounded-full object-cover border border-cream"
//                                     />
//                                     <span className="text-cream text-md hidden sm:block font-mont">
//                                         {customer.name || 'User'}
//                                     </span>
//                                 </div>

//                                 {isProfileDropdownOpen && (
//                                     <ul className="absolute top-[120%] right-0 bg-cream w-[150px] p-4 rounded-lg shadow-lg z-30 transition-all duration-200">
//                                         <li>
//                                             <Link
//                                                 href={route('user.profile')}
//                                                 className="block px-2 py-2 text-dark2 text-sm hover:bg-gradient-to-r from-dark1 to-dark2 hover:text-cream rounded font-mont"
//                                                 onClick={() => setIsProfileDropdownOpen(false)}
//                                             >
//                                                 Profile
//                                             </Link>
//                                         </li>
//                                         <li>
//                                             <button
//                                                 onClick={handleLogout}
//                                                 className="block w-full text-left px-2 py-2 text-dark2 text-sm hover:bg-gradient-to-r from-dark1 to-dark2 hover:text-cream rounded font-mont"
//                                             >
//                                                 Logout
//                                             </button>
//                                         </li>
//                                     </ul>
//                                 )}
//                             </li>
//                         ) : (
//                             <li className="text-cream text-md hidden lg:block font-mont">
//                                 <Link href={route('customer.login')}>SIGN IN</Link>
//                             </li>
//                         )}

//                         <li className="text-cream relative">
//                             <Link href="/cart">
//                                 <GrBasket size={35} />
//                                 {cartCount > 0 && (
//                                     <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red text-cream flex justify-center items-center text-xs font-mont">
//                                         {cartCount}
//                                     </div>
//                                 )}
//                             </Link>
//                         </li>
//                     </ul>
//                 </div>

//                 {/* Mobile Menu */}
//                 {showMobileMenu && (
//                     <div
//                         ref={mobileMenuRef}
//                         className={`lg:hidden fixed ${isSticky ? "top-14" : "top-[72px]"} left-0 right-0 bg-dark2 shadow-lg z-40 max-h-[80vh] overflow-y-auto`}
//                     >
//                         <ul className="px-4 py-4 space-y-2">
//                             <li>
//                                 <div
//                                     className="flex items-center justify-between text-cream py-3 px-4 rounded-lg hover:bg-nav-gradient cursor-pointer font-mont"
//                                     onClick={() => setMobileShopOpen(!mobileShopOpen)}
//                                 >
//                                     <span>OUR PRODUCTS</span>
//                                     <FaChevronDown className={`transition-transform ${mobileShopOpen ? "rotate-180" : ""}`} />
//                                 </div>

//                                 {mobileShopOpen && (
//                                     <ul className="bg-cream/10 ml-4 mt-2 rounded-lg space-y-1">
//                                         <li>
//                                             <div
//                                                 onClick={() => goToCategory()}
//                                                 className="text-cream py-2 px-4 hover:bg-cream/20 cursor-pointer font-mont"
//                                             >
//                                                 All Products
//                                             </div>
//                                         </li>
//                                         {categoriess?.map((cat) => (
//                                             <li key={cat.id}>
//                                                 <div
//                                                     onClick={() => goToCategory(cat.id)}
//                                                     className="text-cream py-2 px-4 hover:bg-cream/20 cursor-pointer font-mont"
//                                                 >
//                                                     {cat.name}
//                                                 </div>

//                                                 {cat.sub_categories?.length > 0 && (
//                                                     <ul className="ml-6 mt-1">
//                                                         {cat.sub_categories.map((sub) => (
//                                                             <li key={sub.id}>
//                                                                 <div
//                                                                     onClick={() => goToCategory(sub.id)}
//                                                                     className="text-cream py-2 px-4 hover:bg-cream/20 cursor-pointer text-sm font-mont"
//                                                                 >
//                                                                     {sub.name}
//                                                                 </div>
//                                                             </li>
//                                                         ))}
//                                                     </ul>
//                                                 )}
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 )}
//                             </li>

//                             {["about", "contact", "customize"].map((page) => (
//                                 <li key={page}>
//                                     <Link
//                                         href={route(page)}
//                                         className="block text-cream py-3 px-4 rounded-lg hover:bg-nav-gradient font-mont uppercase"
//                                         onClick={toggleMobileMenu}
//                                     >
//                                         {page.charAt(0).toUpperCase() + page.slice(1)}
//                                     </Link>
//                                 </li>
//                             ))}

//                             {!customer && (
//                                 <li>
//                                     <Link
//                                         href={route('customer.login')}
//                                         className="block text-cream py-3 px-4 rounded-lg hover:bg-nav-gradient font-mont"
//                                         onClick={toggleMobileMenu}
//                                     >
//                                         SIGN IN
//                                     </Link>
//                                 </li>
//                             )}
//                         </ul>
//                     </div>
//                 )}

//                 {/* Search Overlay – এখন কাজ করে */}
//                 <div
//                     ref={searchBarRef}
//                     className={`fixed inset-x-0 px-4 sm:px-6 lg:px-20 py-6 bg-dark2 transition-all duration-500 z-50 ${showSearchbar ? "top-0 opacity-100" : "-top-full opacity-0"}`}
//                 >
//                     <div className="flex justify-between items-center mb-4">
//                         <h4 className="text-cream text-lg font-mont">Search Our Product</h4>
//                         <button onClick={toggleSearch} className="text-cream text-2xl">×</button>
//                     </div>
//                     <form onSubmit={handleSearchSubmit}>
//                         <div className="border-b border-gray flex items-center">
//                             <input
//                                 type="text"
//                                 placeholder="Are You Looking For?"
//                                 className="py-2 w-full bg-dark2 text-cream placeholder:text-gray focus:outline-none"
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                             />
//                             <button type="submit">
//                                 <IoSearchSharp className="text-gray text-xl" />
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Navbar;