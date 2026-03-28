import React, { useState, useEffect, useCallback } from "react";
import { Head, router } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import { TfiAngleLeft, TfiAngleRight } from "react-icons/tfi";
import CustomOrderBanner from "../components/CustomOrderBanner";
import ProductCardTwo from "../components/ProductCardTwo";
import { IoMdClose } from "react-icons/io";
import { RiSoundModuleLine } from "react-icons/ri";
import { Range, getTrackBackground } from "react-range";
import { route } from "ziggy-js";

const Shop = ({ products,  filters = {}, categories = [], brands = [], colors = [], sizes = [] }) => {
    const STEP = 10;
    const MIN = 0;
    const MAX = 5000;

    const [filter, setFilter] = useState(false);
    const [rangeValues, setRangeValues] = useState([MIN, MAX]);

    // Extract filters from controller ($request->all())
    const {
        q = "",
        sort_by = "",
        min_price = "",
        max_price = "",
        category_ids = [],
        brand_ids = [],
        color_ids = [],
        size_ids = [],
        page = 1,
    } = filters;

    const currentPage = Number(page);

    // Convert to number arrays
    const selectedCategories = Array.isArray(category_ids) ? category_ids.map(Number) : [];
    const selectedBrands = Array.isArray(brand_ids) ? brand_ids.map(Number) : [];
    const selectedColors = Array.isArray(color_ids) ? color_ids.map(Number) : [];
    const selectedSizes = Array.isArray(size_ids) ? size_ids.map(Number) : [];

    // Sync price slider with URL
    useEffect(() => {
        const min = min_price ? Number(min_price) : MIN;
        const max = max_price ? Number(max_price) : MAX;
        setRangeValues([min, max]);
    }, [min_price, max_price]);

    // Update URL (Laravel receives category_ids, brand_ids etc. directly)
    const updateURL = useCallback((overrides) => {
        const params = new URLSearchParams();

        if (overrides.q !== undefined) overrides.q ? params.set("q", overrides.q) : params.delete("q");
        if (overrides.sort_by !== undefined) overrides.sort_by ? params.set("sort_by", overrides.sort_by) : params.delete("sort_by");
        if (overrides.min_price !== undefined) overrides.min_price ? params.set("min_price", overrides.min_price) : params.delete("min_price");
        if (overrides.max_price !== undefined) overrides.max_price ? params.set("max_price", overrides.max_price) : params.delete("max_price");

        params.delete("category_ids");
        (overrides.category_ids || []).forEach(id => params.append("category_ids", id));

        params.delete("brand_ids");
        (overrides.brand_ids || []).forEach(id => params.append("brand_ids", id));

        params.delete("color_ids");
        (overrides.color_ids || []).forEach(id => params.append("color_ids", id));

        params.delete("size_ids");
        (overrides.size_ids || []).forEach(id => params.append("size_ids", id));

        if (overrides.page && overrides.page !== 1) params.set("page", overrides.page);
        else params.delete("page");

        router.get(route("all.products"), params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }, []);

    const toggleCategory = (id) => {
        const newSelected = selectedCategories.includes(id)
            ? selectedCategories.filter(x => x !== id)
            : [...selectedCategories, id];
        updateURL({ category_ids: newSelected, page: 1 });
    };

    const toggleBrand = (id) => {
        const newSelected = selectedBrands.includes(id)
            ? selectedBrands.filter(x => x !== id)
            : [...selectedBrands, id];
        updateURL({ brand_ids: newSelected, page: 1 });
    };

    const toggleColor = (id) => {
        const newSelected = selectedColors.includes(id)
            ? selectedColors.filter(x => x !== id)
            : [...selectedColors, id];
        updateURL({ color_ids: newSelected, page: 1 });
    };

    const toggleSize = (id) => {
        const newSelected = selectedSizes.includes(id)
            ? selectedSizes.filter(x => x !== id)
            : [...selectedSizes, id];
        updateURL({ size_ids: newSelected, page: 1 });
    };

    const handleRangeChange = (values) => {
        const [newMin, newMax] = values;
        setRangeValues([newMin, newMax]);

        const shouldSetMaxTo5000 = newMin > 0;
        const finalMaxPrice = shouldSetMaxTo5000 ? 5000 : newMax < 5000 ? newMax : "";

        updateURL({
            min_price: newMin > 0 ? newMin : "",
            max_price: finalMaxPrice,
            page: 1,
        });
    };

    const handleSortChange = (value) => {
        updateURL({ sort_by: value, page: 1 });
    };

    const handlePageClick = (page) => {
        updateURL({ page });
    };

    const clearAllFilters = () => {
        setRangeValues([MIN, MAX]);
        updateURL({
            q: "",
            sort_by: "",
            min_price: "",
            max_price: "",
            category_ids: [],
            brand_ids: [],
            color_ids: [],
            size_ids: [],
            page: 1,
        });
    };

    const hasActiveFilters =
        selectedCategories.length > 0 ||
        selectedBrands.length > 0 ||
        selectedColors.length > 0 ||
        selectedSizes.length > 0 ||
        min_price ||
        max_price ||
        sort_by ||
        q;

    const totalPages = products.last_page || 1;
    const totalProducts = products.total || 0;

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

    return (
        <div className="bg-dark1">
            <div className="px-4 xl:px-20 max-w-[1200px] mx-auto pb-[140px]">
                {/* Breadcrumb */}
                <div className="py-4 lg:py-[47px]">
                    <ul className="flex justify-end gap-4">
                        <li>
                            <Link href="/" className="text-cream text-[18px] font-mont">
                                Home
                            </Link>
                        </li>
                        <li className="text-cream text-[18px]">/</li>
                        <li className="text-cream text-[18px] font-mont">Shop</li>
                    </ul>
                </div>

                <div className="flex gap-4 relative">
                    {/* Overlay */}
                    {filter && (
                        <div
                            className="fixed inset-0 bg-dark1 bg-opacity-60 z-40 xl:hidden"
                            onClick={() => setFilter(false)}
                        />
                    )}

                    {/* Sidebar */}
                    <div
                        className={`fixed top-0 left-0 h-full w-full max-w-[300px] bg-dark1 z-50 transition-transform duration-300 ease-in-out xl:static xl:z-0 xl:translate-x-0 ${
                            filter ? "translate-x-0" : "-translate-x-full"
                        }`}
                    >
                        <div className="p-4 h-full overflow-y-auto">
                            <div className="flex justify-between">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-xl text-cream font-mont">Filters</h3>
                                    <button onClick={() => setFilter(false)} className="xl:hidden">
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
                                    onClick={() => updateURL({ category_ids: [], page: 1 })}
                                    className={`flex items-center gap-3 w-full text-left font-mont ${
                                        selectedCategories.length === 0 ? "text-cream font-bold" : "text-gray"
                                    }`}
                                >
                                    <input type="checkbox" checked={selectedCategories.length === 0} readOnly className="accent-cream" />
                                    All Categories ({totalProducts})
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => toggleCategory(cat.id)}
                                        className={`flex items-center gap-3 w-full text-left mt-2 font-mont ${
                                            selectedCategories.includes(cat.id) ? "text-cream font-medium" : "text-gray"
                                        }`}
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
                                        className={`flex items-center gap-3 w-full text-left mt-2 font-mont ${
                                            selectedBrands.includes(brand.id) ? "text-cream font-medium" : "text-gray"
                                        }`}
                                    >
                                        <input type="checkbox" checked={selectedBrands.includes(brand.id)} readOnly className="accent-cream" />
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
                                                    isSelected ? "border-cream scale-110 ring-4 ring-cream/30" : "border-gray-600"
                                                }`}
                                                style={{ backgroundColor: color.color_code }}
                                                title={color.color_name}
                                            >
                                                {isSelected && (
                                                    <svg className="w-5 h-5 text-white mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
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
                                                    isSelected ? "bg-cream text-black" : "bg-dark3 text-cream border border-gray-600 hover:border-cream"
                                                }`}
                                            >
                                                {size.size_name.toUpperCase()}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Price Range */}
                            {/* <div className="mb-8 pr-10 ml-2">
                                <h4 className="font-semibold text-cream mb-3">Price Range</h4>
                                <div className="flex justify-between text-gray mb-2">
                                    <span>${rangeValues[0]}</span>
                                    <span>${rangeValues[1]}</span>
                                </div>
                                <Range
                                    values={rangeValues}
                                    step={STEP}
                                    min={MIN}
                                    max={MAX}
                                    rtl={false}
                                    onChange={(values) => handleRangeChange(values)}
                                    renderTrack={({ props, children }) => (
                                        <div
                                            onMouseDown={props.onMouseDown}
                                            onTouchStart={props.onTouchStart}
                                            style={{ ...props.style, height: "36px", display: "flex", width: "100%" }}
                                        >
                                            <div
                                                ref={props.ref}
                                                style={{
                                                    height: "5px",
                                                    width: "100%",
                                                    borderRadius: "4px",
                                                    background: getTrackBackground({
                                                        values: rangeValues,
                                                        colors: ["#ccc", "#FFA500", "#ccc"],
                                                        min: MIN,
                                                        max: MAX,
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
                                                    backgroundColor: isDragged ? "#FFA500" : "#CCC",
                                                }}
                                            />
                                        </div>
                                    )}
                                   
                                />
                            </div> */}
                            
{/* Price Range */}
<div className="mb-8 pr-10 ml-2">
    <h4 className="font-semibold text-cream mb-3">Price Range</h4>
    <div className="flex justify-between text-gray mb-2">
        <span>${rangeValues[0]}</span>
        <span>${rangeValues[1]}</span>
    </div>
    <Range
        values={rangeValues}
        step={STEP}
        min={MIN}
        max={MAX}
        rtl={false}
        onChange={(values) => handleRangeChange(values)}
        renderTrack={({ props, children }) => (
            <div
                onMouseDown={props.onMouseDown}
                onTouchStart={props.onTouchStart}
                style={{ ...props.style, height: "36px", display: "flex", width: "100%" }}
            >
                <div
                    ref={props.ref}
                    style={{
                        height: "5px",
                        width: "100%",
                        borderRadius: "4px",
                        background: getTrackBackground({
                            values: rangeValues,
                            colors: ["#ccc", "#FFA500", "#ccc"],
                            min: MIN,
                            max: MAX,
                        }),
                        alignSelf: "center",
                    }}
                >
                    {children}
                </div>
            </div>
        )}
        renderThumb={({ props, index, isDragged }) => (
            <div
                {...props}
                key={index}  // এখানে key দিলাম index দিয়ে → unique হবে
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
                        backgroundColor: isDragged ? "#FFA500" : "#CCC",
                    }}
                />
            </div>
        )}
    />
</div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="w-full xl:w-4/5">
                        <div className="flex">
                            <div className="px-4 pb-6 flex flex-wrap justify-between items-center gap-4">
                                <p className="text-cream">
                                    Showing {products.data.length} of {totalProducts} products
                                </p>
                                <select
                                    value={sort_by}
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
                            </div>
                            <button
                                onClick={() => setFilter(true)}
                                className="xl:hidden text-cream px-5 py-1 shadow-2xl z-30 flex items-center gap-2"
                            >
                                <RiSoundModuleLine /> Filter
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 px-4 xl:px-0">
                            {products.data.length === 0 ? (
                                <p className="col-span-full text-center text-cream text-2xl py-10">
                                    No products found
                                </p>
                            ) : (
                                products.data.map((product) => (
                                    <ProductCardTwo key={product.id} product={product} />
                                ))
                            )}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center mt-10 gap-2">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageClick(currentPage - 1)}
                                    className="p-2 disabled:opacity-50"
                                >
                                    <TfiAngleLeft />
                                </button>
                                {getPageNumbers().map((p, i) =>
                                    typeof p === "number" ? (
                                        <button
                                            key={i}
                                            onClick={() => handlePageClick(p)}
                                            className={`w-10 h-10 rounded ${
                                                currentPage === p ? "bg-cream text-black" : "bg-dark2 text-cream"
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
                                    onClick={() => handlePageClick(currentPage + 1)}
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

