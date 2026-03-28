// import React, { useState, useEffect } from "react";
// import { Link, usePage, router } from "@inertiajs/react";
// import { TfiAngleLeft, TfiAngleRight } from "react-icons/tfi";
// import { IoMdClose } from "react-icons/io";
// import { RiSoundModuleLine } from "react-icons/ri";
// import CustomOrderBanner from "../components/CustomOrderBanner";
// import ProductCardTwo from "../components/ProductCardTwo";
// import { Range, getTrackBackground } from "react-range";
// import { route } from "ziggy-js";

// const Shop = () => {
//     const { props } = usePage();
//     const {
//         products: paginatedProducts,
//         filters: serverFilters,
//         categories,
//         brands,
//         colors,
//         sizes,
//     } = props;

//     const products = paginatedProducts.data || [];
//     const totalPages = paginatedProducts.last_page || 1;
//     const totalProducts = paginatedProducts.total || 0;
//     const currentPage = paginatedProducts.current_page || 1;

//     // Local state for filters
//     const [filterOpen, setFilterOpen] = useState(false);
//     const [selectedCategories, setSelectedCategories] = useState(
//         serverFilters.category_ids || []
//     );
//     const [selectedBrands, setSelectedBrands] = useState(serverFilters.brand_ids || []);
//     const [selectedColors, setSelectedColors] = useState(serverFilters.color_ids || []);
//     const [selectedSizes, setSelectedSizes] = useState(serverFilters.size_ids || []);
//     const [rangeValues, setRangeValues] = useState([
//         serverFilters.min_price || 0,
//         serverFilters.max_price || 5000,
//     ]);

//     const searchQuery = serverFilters.q || "";
//     const sortBy = serverFilters.sort_by || "";

//     // Sync server filters to local state on page load/change
//     useEffect(() => {
//         setSelectedCategories(serverFilters.category_ids || []);
//         setSelectedBrands(serverFilters.brand_ids || []);
//         setSelectedColors(serverFilters.color_ids || []);
//         setSelectedSizes(serverFilters.size_ids || []);
//         setRangeValues([
//             serverFilters.min_price || 0,
//             serverFilters.max_price || 5000,
//         ]);
//     }, [serverFilters]);

//     // Common function to visit with filters
//     const applyFilters = (newFilters = {}) => {
//         router.visit(route("all.products"), {
//             data: {
//                 ...serverFilters,
//                 page: 1, // ফিল্টার চেঞ্জ হলে প্রথম পেজে যাক
//                 ...newFilters,
//             },
//             preserveState: true,
//             preserveScroll: true,
//             only: ["products", "filters"], // শুধু এই প্রপসগুলো রিলোড করবে
//         });
//     };

//     const toggleCategory = (id) => {
//         const newSelected = selectedCategories.includes(id)
//             ? selectedCategories.filter((x) => x !== id)
//             : [...selectedCategories, id];
//         setSelectedCategories(newSelected);
//         applyFilters({ category_ids: newSelected.length ? newSelected : null });
//     };

//     const toggleBrand = (id) => {
//         const newSelected = selectedBrands.includes(id)
//             ? selectedBrands.filter((x) => x !== id)
//             : [...selectedBrands, id];
//         setSelectedBrands(newSelected);
//         applyFilters({ brand_ids: newSelected.length ? newSelected : null });
//     };

//     const toggleColor = (id) => {
//         const newSelected = selectedColors.includes(id)
//             ? selectedColors.filter((x) => x !== id)
//             : [...selectedColors, id];
//         setSelectedColors(newSelected);
//         applyFilters({ color_ids: newSelected.length ? newSelected : null });
//     };

//     const toggleSize = (id) => {
//         const newSelected = selectedSizes.includes(id)
//             ? selectedSizes.filter((x) => x !== id)
//             : [...selectedSizes, id];
//         setSelectedSizes(newSelected);
//         applyFilters({ size_ids: newSelected.length ? newSelected : null });
//     };

//     const handleRangeChange = (values) => {
//         const [min, max] = values;
//         setRangeValues([min, max]);
//         applyFilters({
//             min_price: min > 0 ? min : null,
//             max_price: max < 5000 ? max : null,
//         });
//     };

//     const handleSortChange = (value) => {
//         applyFilters({ sort_by: value || null });
//     };

//     const handlePageChange = (page) => {
//         router.visit(route("all.products"), {
//             data: { ...serverFilters, page },
//             preserveState: true,
//             preserveScroll: true,
//             only: ["products", "filters"],
//         });
//     };

//     const clearAllFilters = () => {
//         setSelectedCategories([]);
//         setSelectedBrands([]);
//         setSelectedColors([]);
//         setSelectedSizes([]);
//         setRangeValues([0, 5000]);
//         router.visit(route("all.products"), {
//             data: {},
//             preserveState: true,
//             preserveScroll: true,
//             only: ["products", "filters"],
//         });
//     };

//     const hasActiveFilters =
//         selectedCategories.length > 0 ||
//         selectedBrands.length > 0 ||
//         selectedColors.length > 0 ||
//         selectedSizes.length > 0 ||
//         serverFilters.min_price ||
//         serverFilters.max_price ||
//         sortBy ||
//         searchQuery;

//     const getPageNumbers = () => {
//         const pages = [];
//         if (totalPages <= 5) {
//             for (let i = 1; i <= totalPages; i++) pages.push(i);
//         } else {
//             pages.push(1);
//             if (currentPage > 3) pages.push("...");
//             const start = Math.max(2, currentPage - 1);
//             const end = Math.min(totalPages - 1, currentPage + 1);
//             for (let i = start; i <= end; i++) pages.push(i);
//             if (currentPage < totalPages - 2) pages.push("...");
//             if (totalPages > 1) pages.push(totalPages);
//         }
//         return pages;
//     };

//     useEffect(() => {
//         window.dispatchEvent(new Event("pageloaded"));
//     }, []);

//     return (
//         <div className="bg-dark1">
//             <div className="px-4 xl:px-20 max-w-[1200px] mx-auto pb-[140px]">
//                 {/* Breadcrumb */}
//                 <div className="py-4 lg:py-[47px]">
//                     <ul className="flex justify-end gap-4">
//                         <li>
//                             <Link to="/" className="text-cream text-[18px] font-mont">
//                                 Home
//                             </Link>
//                         </li>
//                         <li className="text-cream text-[18px]">/</li>
//                         <li className="text-cream text-[18px] font-mont">Shop</li>
//                     </ul>
//                 </div>

//                 <div className="flex gap-4 relative">
//                     {/* Mobile Overlay */}
//                     {filterOpen && (
//                         <div
//                             className="fixed inset-0 bg-dark1 bg-opacity-60 z-40 xl:hidden"
//                             onClick={() => setFilterOpen(false)}
//                         />
//                     )}

//                     {/* Sidebar */}
//                     <div
//                         className={`fixed top-0 left-0 h-full w-full max-w-[300px] bg-dark1 z-50 transition-transform duration-300 xl:static xl:z-0 xl:translate-x-0 ${
//                             filterOpen ? "translate-x-0" : "-translate-x-full"
//                         }`}
//                     >
//                         <div className="p-4 h-full overflow-y-auto">
//                             <div className="flex justify-between items-center mb-6">
//                                 <h3 className="font-bold text-xl text-cream font-mont">Filters</h3>
//                                 <button onClick={() => setFilterOpen(false)} className="xl:hidden">
//                                     <IoMdClose className="text-cream text-2xl" />
//                                 </button>
//                             </div>

//                             {hasActiveFilters && (
//                                 <button
//                                     onClick={clearAllFilters}
//                                     className="text-red-400 text-sm mb-6 block cursor-pointer font-mont"
//                                 >
//                                     Clear Filters
//                                 </button>
//                             )}

//                             {/* Categories */}
//                             <div className="mb-8">
//                                 <h4 className="font-semibold text-cream mb-3 font-mont">Categories</h4>
//                                 <button
//                                     onClick={() => {
//                                         setSelectedCategories([]);
//                                         applyFilters({ category_ids: null });
//                                     }}
//                                     className={`flex items-center gap-3 w-full text-left font-mont ${
//                                         selectedCategories.length === 0
//                                             ? "text-cream font-bold"
//                                             : "text-gray"
//                                     }`}
//                                 >
//                                     <input
//                                         type="checkbox"
//                                         checked={selectedCategories.length === 0}
//                                         readOnly
//                                         className="accent-cream"
//                                     />
//                                     All Categories ({totalProducts})
//                                 </button>
//                                 {categories.map((cat) => (
//                                     <button
//                                         key={cat.id}
//                                         onClick={() => toggleCategory(cat.id)}
//                                         className={`flex items-center gap-3 w-full text-left mt-2 font-mont ${
//                                             selectedCategories.includes(cat.id)
//                                                 ? "text-cream font-medium"
//                                                 : "text-gray"
//                                         }`}
//                                     >
//                                         <input
//                                             type="checkbox"
//                                             checked={selectedCategories.includes(cat.id)}
//                                             readOnly
//                                             className="accent-cream"
//                                         />
//                                         {cat.name}
//                                     </button>
//                                 ))}
//                             </div>

//                             {/* Brands */}
//                             <div className="mb-8">
//                                 <h4 className="font-semibold text-cream mb-3 font-mont">Brands</h4>
//                                 {brands.map((brand) => (
//                                     <button
//                                         key={brand.id}
//                                         onClick={() => toggleBrand(brand.id)}
//                                         className={`flex items-center gap-3 w-full text-left mt-2 ${
//                                             selectedBrands.includes(brand.id)
//                                                 ? "text-cream font-medium"
//                                                 : "text-gray"
//                                         }`}
//                                     >
//                                         <input
//                                             type="checkbox"
//                                             checked={selectedBrands.includes(brand.id)}
//                                             readOnly
//                                             className="accent-cream"
//                                         />
//                                         {brand.name}
//                                     </button>
//                                 ))}
//                             </div>

//                             {/* Colors */}
//                             <div className="mb-8">
//                                 <h4 className="font-semibold text-cream mb-4">Colors</h4>
//                                 <div className="flex flex-wrap gap-4">
//                                     {colors.map((color) => {
//                                         const isSelected = selectedColors.includes(color.id);
//                                         return (
//                                             <button
//                                                 key={color.id}
//                                                 onClick={() => toggleColor(color.id)}
//                                                 className={`w-10 h-10 rounded-full border-4 transition-all duration-200 shadow-lg hover:scale-110 ${
//                                                     isSelected
//                                                         ? "border-cream scale-110 ring-4 ring-cream/30"
//                                                         : "border-gray-600"
//                                                 }`}
//                                                 style={{ backgroundColor: color.color_code }}
//                                                 title={color.color_name}
//                                             >
//                                                 {isSelected && (
//                                                     <svg
//                                                         className="w-5 h-5 text-white mx-auto"
//                                                         fill="currentColor"
//                                                         viewBox="0 0 20 20"
//                                                     >
//                                                         <path
//                                                             fillRule="evenodd"
//                                                             d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                                                             clipRule="evenodd"
//                                                         />
//                                                     </svg>
//                                                 )}
//                                             </button>
//                                         );
//                                     })}
//                                 </div>
//                             </div>

//                             {/* Sizes */}
//                             <div className="mb-8">
//                                 <h4 className="font-semibold text-cream mb-4">Sizes</h4>
//                                 <div className="flex flex-wrap gap-3">
//                                     {sizes.map((size) => {
//                                         const isSelected = selectedSizes.includes(size.id);
//                                         return (
//                                             <button
//                                                 key={size.id}
//                                                 onClick={() => toggleSize(size.id)}
//                                                 className={`px-4 py-2 rounded-md font-semibold text-sm transition-all shadow-md ${
//                                                     isSelected
//                                                         ? "bg-cream text-black"
//                                                         : "bg-dark3 text-cream border border-gray-600 hover:border-cream"
//                                                 }`}
//                                             >
//                                                 {size.size_name.toUpperCase()}
//                                             </button>
//                                         );
//                                     })}
//                                 </div>
//                             </div>

//                             {/* Price Range */}
//                             <div className="mb-8 pr-10 ml-2">
//                                 <h4 className="font-semibold text-cream mb-3">Price Range</h4>
//                                 <div className="flex justify-between text-gray mb-2">
//                                     <span>${rangeValues[0]}</span>
//                                     <span>${rangeValues[1]}</span>
//                                 </div>
//                                 <Range
//                                     values={rangeValues}
//                                     step={10}
//                                     min={0}
//                                     max={5000}
//                                     onChange={handleRangeChange}
//                                     renderTrack={({ props, children }) => (
//                                         <div
//                                             onMouseDown={props.onMouseDown}
//                                             onTouchStart={props.onTouchStart}
//                                             style={{
//                                                 ...props.style,
//                                                 height: "36px",
//                                                 display: "flex",
//                                                 width: "100%",
//                                             }}
//                                         >
//                                             <div
//                                                 ref={props.ref}
//                                                 style={{
//                                                     height: "5px",
//                                                     width: "100%",
//                                                     borderRadius: "4px",
//                                                     background: getTrackBackground({
//                                                         values: rangeValues,
//                                                         colors: ["#ccc", "#548BF4", "#ccc"],
//                                                         min: 0,
//                                                         max: 5000,
//                                                     }),
//                                                     alignSelf: "center",
//                                                 }}
//                                             >
//                                                 {children}
//                                             </div>
//                                         </div>
//                                     )}
//                                     renderThumb={({ props, isDragged }) => (
//                                         <div
//                                             {...props}
//                                             style={{
//                                                 ...props.style,
//                                                 height: "20px",
//                                                 width: "20px",
//                                                 borderRadius: "50%",
//                                                 backgroundColor: "#FFF",
//                                                 display: "flex",
//                                                 justifyContent: "center",
//                                                 alignItems: "center",
//                                                 boxShadow: "0px 2px 6px #AAA",
//                                             }}
//                                         >
//                                             <div
//                                                 style={{
//                                                     height: "16px",
//                                                     width: "5px",
//                                                     backgroundColor: isDragged ? "#548BF4" : "#CCC",
//                                                 }}
//                                             />
//                                         </div>
//                                     )}
//                                 />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Main Content */}
//                     <div className="w-full xl:w-4/5">
//                         <div className="flex flex-wrap justify-between items-center gap-4 px-4 pb-6">
//                             <p className="text-cream">
//                                 Showing {products.length} of {totalProducts} products
//                             </p>
//                             <select
//                                 value={sortBy}
//                                 onChange={(e) => handleSortChange(e.target.value)}
//                                 className="bg-dark2 text-cream px-4 py-2 rounded"
//                             >
//                                 <option value="">Default</option>
//                                 <option value="latest">Latest</option>
//                                 <option value="featureproduct">Featured</option>
//                                 <option value="lowtohigh">Low to High</option>
//                                 <option value="hightolow">High to Low</option>
//                                 <option value="recommended">Recommended</option>
//                             </select>
//                             <button
//                                 onClick={() => setFilterOpen(true)}
//                                 className="xl:hidden text-cream px-5 py-1 shadow-2xl z-30 flex items-center gap-2"
//                             >
//                                 <RiSoundModuleLine /> Filter
//                             </button>
//                         </div>

//                         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 px-4 xl:px-0">
//                             {products.length === 0 ? (
//                                 <p className="col-span-full text-center text-cream text-2xl py-10">
//                                     No products found
//                                 </p>
//                             ) : (
//                                 products.map((product) => (
//                                     <ProductCardTwo key={product.id} product={product} />
//                                 ))
//                             )}
//                         </div>

//                         {totalPages > 1 && (
//                             <div className="flex justify-center mt-10 gap-2">
//                                 <button
//                                     disabled={currentPage === 1}
//                                     onClick={() => handlePageChange(currentPage - 1)}
//                                     className="p-2 disabled:opacity-50"
//                                 >
//                                     <TfiAngleLeft />
//                                 </button>
//                                 {getPageNumbers().map((p, i) =>
//                                     typeof p === "number" ? (
//                                         <button
//                                             key={i}
//                                             onClick={() => handlePageChange(p)}
//                                             className={`w-10 h-10 rounded ${
//                                                 currentPage === p
//                                                     ? "bg-cream text-black"
//                                                     : "bg-dark2 text-cream"
//                                             }`}
//                                         >
//                                             {p}
//                                         </button>
//                                     ) : (
//                                         <span key={i}>...</span>
//                                     )
//                                 )}
//                                 <button
//                                     disabled={currentPage === totalPages}
//                                     onClick={() => handlePageChange(currentPage + 1)}
//                                     className="p-2 disabled:opacity-50"
//                                 >
//                                     <TfiAngleRight />
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//                 <CustomOrderBanner />
//             </div>
//         </div>
//     );
// };

// export default Shop;


import React, { useState, useEffect } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { TfiAngleLeft, TfiAngleRight } from "react-icons/tfi";
import { IoMdClose } from "react-icons/io";
import { RiSoundModuleLine } from "react-icons/ri";
import CustomOrderBanner from "../components/CustomOrderBanner";
import ProductCardTwo from "../components/ProductCardTwo";
import { Range, getTrackBackground } from "react-range";
import { route } from "ziggy-js";
import { debounce } from "lodash";
import { useRef } from "react";

const Shop = () => {
    const { props } = usePage();
    const {
        products: paginatedProducts,
        filters: serverFilters = {},
        categories = [],
        brands = [],
        colors = [],
        sizes = [],
    } = props;


    
    const products = paginatedProducts.data || [];
    const totalPages = paginatedProducts.last_page || 1;
    const totalProducts = paginatedProducts.total || 0;
    const currentPage = paginatedProducts.current_page || 1;
    // console.log(products);    
    // Local states
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [rangeValues, setRangeValues] = useState([0, 5000]);

    //debounce
    const debouncedVisit = useRef(
    debounce((filters) => {
        router.visit(route("all.products"), {

            data: filters,
            preserveState: true,
            preserveScroll: false,
            only: ["products", "filters"],
        });
    }, 300) // 300ms = instant feel
).current;

    // Helper to convert array values to integers safely
    const toIntArray = (arr) => {
        if (!arr) return [];
        return (Array.isArray(arr) ? arr : [arr]).map(id => parseInt(id, 10)).filter(id => !isNaN(id));
    };

    // Sync server filters → local state (প্রতিবার partial reload-এর পর)
    useEffect(() => {
        setSelectedCategories(toIntArray(serverFilters.category_ids));
        setSelectedBrands(toIntArray(serverFilters.brand_ids));
        setSelectedColors(toIntArray(serverFilters.color_ids));
        setSelectedSizes(toIntArray(serverFilters.size_ids));

        setRangeValues([
            serverFilters.min_price ? parseInt(serverFilters.min_price, 10) : 0,
            serverFilters.max_price ? parseInt(serverFilters.max_price, 10) : 5000,
        ]);
    }, [serverFilters]); // এটা খুবই গুরুত্বপূর্ণ — serverFilters চেঞ্জ হলেই sync হবে

    const searchQuery = serverFilters.q || "";
    const sortBy = serverFilters.sort_by || "";

    // Apply filters without full reload
    // const applyFilters = (newFilters = {}) => {
    //     const cleanedFilters = { ...serverFilters };

    //     // Remove empty arrays/null values
    //     Object.keys(newFilters).forEach(key => {
    //         if (newFilters[key] === null || 
    //             (Array.isArray(newFilters[key]) && newFilters[key].length === 0)) {
    //             delete cleanedFilters[key];
    //         } else {
    //             cleanedFilters[key] = newFilters[key];
    //         }
    //     });

    //     // Reset to page 1 when filtering
    //     if (Object.keys(newFilters).some(key => key !== 'page')) {
    //         cleanedFilters.page = 1;
    //     }

    //     router.visit(route("all.products"), {
    //         data: cleanedFilters,
    //         preserveState: true,
    //         preserveScroll: true,
    //         only: ["products", "filters"],
    //     });
    // };
    const applyFilters = (newFilters = {}) => {
    const cleanedFilters = { ...serverFilters };

    Object.keys(newFilters).forEach((key) => {
        if (
            newFilters[key] === null ||
            (Array.isArray(newFilters[key]) && newFilters[key].length === 0)
        ) {
            delete cleanedFilters[key];
        } else {
            cleanedFilters[key] = newFilters[key];
        }
    });

    // filter change হলে page reset
    cleanedFilters.page = 1;

    debouncedVisit(cleanedFilters);
};


    // Toggle functions
    const toggleCategory = (id) => {
        const newSelected = selectedCategories.includes(id)
            ? selectedCategories.filter(x => x !== id)
            : [...selectedCategories, id];
        setSelectedCategories(newSelected);
        applyFilters({ category_ids: newSelected.length ? newSelected : null });
    };

    const toggleBrand = (id) => {
        const newSelected = selectedBrands.includes(id)
            ? selectedBrands.filter(x => x !== id)
            : [...selectedBrands, id];
        setSelectedBrands(newSelected);
        applyFilters({ brand_ids: newSelected.length ? newSelected : null });
    };

    const toggleColor = (id) => {
        const newSelected = selectedColors.includes(id)
            ? selectedColors.filter(x => x !== id)
            : [...selectedColors, id];
        setSelectedColors(newSelected);
        applyFilters({ color_ids: newSelected.length ? newSelected : null });
    };

    const toggleSize = (id) => {
        const newSelected = selectedSizes.includes(id)
            ? selectedSizes.filter(x => x !== id)
            : [...selectedSizes, id];
        setSelectedSizes(newSelected);
        applyFilters({ size_ids: newSelected.length ? newSelected : null });
    };

    // const handleRangeChange = (values) => {
    //     const [min, max] = values;
    //     setRangeValues([min, max]);
    //     applyFilters({
    //         min_price: min > 0 ? min : null,
    //         max_price: max < 5000 ? max : null,
    //     });
    // };
    const handleRangeChange = (values) => {
    setRangeValues(values);
};

const handleRangeFinal = (values) => {
    const [min, max] = values;
    applyFilters({
        min_price: min > 0 ? min : null,
        max_price: max < 5000 ? max : null,
    });
};
    const handleSortChange = (value) => {
        applyFilters({ sort_by: value || null });
    };

    const handlePageChange = (page) => {
        router.visit(route("all.products"), {
            data: { ...serverFilters, page },
            preserveState: true,
            preserveScroll: false,
            only: ["products", "filters"],
        });
    };

    const clearAllFilters = () => {
        setSelectedCategories([]);
        setSelectedBrands([]);
        setSelectedColors([]);
        setSelectedSizes([]);
        setRangeValues([0, 5000]);
        router.visit(route("all.products"), {
            data: { page: 1 },
            preserveState: true,
            preserveScroll: false,
            only: ["products", "filters"],
        });
    };

    const hasActiveFilters =
        selectedCategories.length > 0 ||
        selectedBrands.length > 0 ||
        selectedColors.length > 0 ||
        selectedSizes.length > 0 ||
        serverFilters.min_price ||
        serverFilters.max_price ||
        sortBy ||
        searchQuery;

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push("...");
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (currentPage < totalPages - 2) pages.push("...");
            if (totalPages > 1) pages.push(totalPages);
        }
        return pages;
    };

    useEffect(() => {
        window.dispatchEvent(new Event("pageloaded"));
    }, []);

    // বাকি JSX একই আছে (শুধু selected* states ব্যবহার করছি)
    return (
        <div className="bg-dark1">
            <div className="px-4 xl:px-20 max-w-[1200px] mx-auto pb-[140px]">
                {/* Breadcrumb */}
                <div className="py-4 lg:py-[47px]">
                    <ul className="flex justify-end gap-4">
                        <li><Link to="/" className="text-cream text-[18px] font-mont">Home</Link></li>
                        <li className="text-cream text-[18px]">/</li>
                        <li className="text-cream text-[18px] font-mont">Shop</li>
                    </ul>
                </div>

                <div className="flex gap-4 relative">
                    {/* Mobile Overlay */}
                    {filterOpen && (
                        <div className="fixed inset-0 bg-dark1 bg-opacity-60 z-40 xl:hidden" onClick={() => setFilterOpen(false)} />
                    )}

                    {/* Sidebar */}
                    <div className={`fixed top-0 left-0 h-full w-full max-w-[300px] bg-dark1 z-50 transition-transform duration-300 xl:static xl:z-0 xl:translate-x-0 ${filterOpen ? "translate-x-0" : "-translate-x-full"}`}>
                        <div className="p-4 h-full overflow-y-auto">
                          <div className="flex justify-between items-center mb-3">
                              <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-xl text-cream font-mont">Filters</h3>
                                <button onClick={() => setFilterOpen(false)} className="xl:hidden">
                                    <IoMdClose className="text-cream text-2xl" />
                                </button>
                            </div>

                            {hasActiveFilters && (
                                <button onClick={clearAllFilters} className="text-red-400 text-sm mb-6 block cursor-pointer font-mont">
                                    Clear Filters
                                </button>
                            )}
                          </div>

                            {/* Categories */}
                            <div className="mb-8">
                                <h4 className="font-semibold text-cream mb-3 font-mont">Categories</h4>
                                <button
                                    onClick={() => {
                                        setSelectedCategories([]);
                                        applyFilters({ category_ids: null });
                                    }}
                                    className={`flex items-center gap-3 w-full text-left font-mont ${selectedCategories.length === 0 ? "text-cream font-bold" : "text-gray"}`}
                                >
                                    <input type="checkbox" checked={selectedCategories.length === 0} readOnly className="accent-cream" />
                                    All Categories ({totalProducts})
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => toggleCategory(cat.id)}
                                        className={`flex items-center gap-3 w-full text-left mt-2 font-mont ${selectedCategories.includes(cat.id) ? "text-cream font-medium" : "text-gray"}`}
                                    >
                                        <input type="checkbox" checked={selectedCategories.includes(cat.id)} readOnly className="accent-cream" />
                                        {cat.name}
                                    </button>
                                ))}
                            </div>

                            {/* Brands */}
                            <div className="mb-8">
                                <h4 className="font-semibold text-cream mb-3 font-mont">Brands</h4>
                                {brands.map((brand) => (
                                    <button
                                        key={brand.id}
                                        onClick={() => toggleBrand(brand.id)}
                                        className={`flex items-center gap-3 w-full text-left mt-2 ${
                                            selectedBrands.includes(brand.id)
                                                ? "text-cream font-medium"
                                                : "text-gray"
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedBrands.includes(brand.id)}
                                            readOnly
                                            className="accent-cream"
                                        />
                                        {brand.name}
                                    </button>
                                ))}
                            </div>

                            {/* Colors */}
                            <div className="mb-8">
                                <h4 className="font-semibold text-cream mb-4">Colors</h4>
                                <div className="flex flex-wrap gap-4">
                                    {colors.map((color) => {
                                        const isSelected = selectedColors.includes(color.id);
                                        return (
                                            <button
                                                key={color.id}
                                                onClick={() => toggleColor(color.id)}
                                                className={`w-10 h-10 rounded-full border-4 transition-all duration-200 shadow-lg hover:scale-110 ${
                                                    isSelected
                                                        ? "border-cream scale-110 ring-4 ring-cream/30"
                                                        : "border-gray-600"
                                                }`}
                                                style={{ backgroundColor: color.color_code }}
                                                title={color.color_name}
                                            >
                                                {isSelected && (
                                                    <svg
                                                        className="w-5 h-5 text-white mx-auto"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Sizes */}
                            <div className="mb-8">
                                <h4 className="font-semibold text-cream mb-4">Sizes</h4>
                                <div className="flex flex-wrap gap-3">
                                    {sizes.map((size) => {
                                        const isSelected = selectedSizes.includes(size.id);
                                        return (
                                            <button
                                                key={size.id}
                                                onClick={() => toggleSize(size.id)}
                                                className={`px-4 py-2 rounded-md font-semibold text-sm transition-all shadow-md ${
                                                    isSelected
                                                        ? "bg-cream text-black"
                                                        : "bg-dark3 text-cream border border-gray-600 hover:border-cream"
                                                }`}
                                            >
                                                {size.size_name.toUpperCase()}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-8 pr-10 ml-2">
                                <h4 className="font-semibold text-cream mb-3">Price Range</h4>
                                <div className="flex justify-between text-gray mb-2">
                                    <span>${rangeValues[0]}</span>
                                    <span>${rangeValues[1]}</span>
                                </div>
                                <Range
                                    values={rangeValues}
                                    step={10}
                                    min={0}
                                    max={5000}
                                    onChange={handleRangeChange}
                                    onFinalChange={handleRangeFinal}
                                    renderTrack={({ props, children }) => (
                                        <div
                                            onMouseDown={props.onMouseDown}
                                            onTouchStart={props.onTouchStart}
                                            style={{
                                                ...props.style,
                                                height: "36px",
                                                display: "flex",
                                                width: "100%",
                                            }}
                                        >
                                            <div
                                                ref={props.ref}
                                                style={{
                                                    height: "5px",
                                                    width: "100%",
                                                    borderRadius: "4px",
                                                    background: getTrackBackground({
                                                        values: rangeValues,
                                                        colors: ["#ccc", "#548BF4", "#ccc"],
                                                        min: 0,
                                                        max: 5000,
                                                    }),
                                                    alignSelf: "center",
                                                }}
                                            >
                                                {children}
                                            </div>
                                        </div>
                                    )}
                                    renderThumb={({ props, isDragged }) => (
                                        <div
                                            {...props}
                                            style={{
                                                ...props.style,
                                                height: "20px",
                                                width: "20px",
                                                borderRadius: "50%",
                                                backgroundColor: "#FFF",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                boxShadow: "0px 2px 6px #AAA",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    height: "16px",
                                                    width: "5px",
                                                    backgroundColor: isDragged ? "#548BF4" : "#CCC",
                                                }}
                                            />
                                        </div>
                                    )}
                                />
                            </div>

                        </div>
                    </div>

                     <div className="w-full xl:w-4/5">
                        <div className="flex flex-wrap justify-between items-center gap-4 px-4 pb-6">
                            <p className="text-cream">
                                Showing {products.length} of {totalProducts} products
                            </p>
                            <select
                                value={sortBy}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="bg-dark2 text-cream px-4 py-2 rounded"
                            >
                                <option value="">Default</option>
                                <option value="latest">Latest</option>
                                <option value="featureproduct">Featured</option>
                                <option value="lowtohigh">Low to High</option>
                                <option value="hightolow">High to Low</option>
                                <option value="recommended">Recommended</option>
                            </select>
                            <button
                                onClick={() => setFilterOpen(true)}
                                className="xl:hidden text-cream px-5 py-1 shadow-2xl z-30 flex items-center gap-2"
                            >
                                <RiSoundModuleLine /> Filter
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 px-4 xl:px-0">
                            {products.length === 0 ? (
                                <p className="col-span-full text-center text-cream text-2xl py-10">
                                    No products found
                                </p>
                            ) : (
                                products.map((product) => (
                                    <ProductCardTwo key={product.id} product={product} />
                                ))
                            )}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center mt-10 gap-2">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className="p-2 disabled:opacity-50"
                                >
                                    <TfiAngleLeft />
                                </button>
                                {getPageNumbers().map((p, i) =>
                                    typeof p === "number" ? (
                                        <button
                                            key={i}
                                            onClick={() => handlePageChange(p)}
                                            className={`w-10 h-10 rounded ${
                                                currentPage === p
                                                    ? "bg-cream text-black"
                                                    : "bg-dark2 text-cream"
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    ) : (
                                        <span key={i}>...</span>
                                    )
                                )}
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className="p-2 disabled:opacity-50"
                                >
                                    <TfiAngleRight />
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
            <CustomOrderBanner />
        </div>
    );
};

export default Shop;