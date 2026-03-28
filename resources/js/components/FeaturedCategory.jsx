import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import React, { useState } from "react";
import { router } from "@inertiajs/react"; 
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CategoryItem = ({ cate, handleCategoryClick }) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    return (
        <div
            onClick={() => handleCategoryClick(cate?.id)}
            className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-3 mt-8"
        >
            <div className="relative overflow-hidden rounded-lg shadow-2xl ring-4 ring-transparent group-hover:ring-red/50 transition-all duration-500">
                <div className="aspect-square w-full relative">
                    {!isImageLoaded && (
                        <div className="absolute inset-0 w-full h-full z-10 leading-none">
                            <SkeletonTheme baseColor="#37352b" highlightColor="#504d40">
                                <Skeleton height="100%" containerClassName="w-full h-full block" className="!h-full !w-full block" borderRadius="0.5rem" />
                            </SkeletonTheme>
                        </div>
                    )}
                    <img
                        src={cate?.image}
                        alt="category image"
                        onLoad={() => setIsImageLoaded(true)}
                        className={`w-full h-full object-cover rounded-lg transition-all duration-700 group-hover:scale-110 ${!isImageLoaded ? 'invisible' : 'visible opacity-100'}`}
                        onError={(e) => {
                            e.target.src = "/placeholder-category.jpg";
                             setIsImageLoaded(true); 
                        }}
                    />
                </div>
            </div>

            <h3 className="text-center mt-4 text-cream font-mont font-semibold text-sm md:text-base tracking-wide group-hover:text-red transition-colors duration-300">
                {cate?.name}
            </h3>

            <div className="mt-1 h-0.5 bg-red w-0 group-hover:w-full mx-auto transition-all duration-500 rounded-full"></div>
        </div>
    );
};

const FeaturedCategory = ({categories}) => {
    const handleCategoryClick = (categoryId) => {
         router.get('/all-products', { category_ids: [categoryId] });
    };

    if (!categories || categories.length === 0) return null;

    return (
        <div className=" bg-dark2 pt-[30px]  ">
            <div className="px-4 sm:px-6 lg:px-10 xl:px-20 max-w-[1200px] mx-auto relative">
                <h2 className="text-3xl md:text-4xl font-bold text-cream text-center mb-4 tracking-wide font-mont">
                    Featured Categories
                </h2>

                {/* Arrows - left*/}
                <div className=" flex absolute inset-y-0 left-20 items-center -ml-10 z-10">
                    <button className="cursor-pointer featured-prev-btn w-12 h-12 bg-red/30 hover:bg-red/60 backdrop-blur-sm border border-red/50 rounded-full flex items-center justify-center text-cream shadow-2xl hover:shadow-red/50 transition-all duration-300">
                        <FaChevronLeft size={24} />
                    </button>
                </div>
                {/* Arrows - right  */}
                <div className="flex absolute inset-y-0 right-20 items-center -mr-10 z-10">
                    <button className="cursor-pointer featured-next-btn w-12 h-12 bg-red/30 hover:bg-red/60 backdrop-blur-sm border border-red/50 rounded-full flex items-center justify-center text-cream shadow-2xl hover:shadow-red/50 transition-all duration-300">
                        <FaChevronRight size={24} />
                    </button>
                </div>

                <Swiper
                    modules={[Autoplay, Navigation]}
                    spaceBetween={24}
                    slidesPerView={2}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    loop={categories.length > 6}
                    navigation={{
                        nextEl: ".featured-next-btn",
                        prevEl: ".featured-prev-btn",
                    }}
                    breakpoints={{
                        640: { slidesPerView: 3, spaceBetween: 20 },
                        768: { slidesPerView: 4, spaceBetween: 24 },
                        1024: { slidesPerView: 5, spaceBetween: 24 },
                        1280: { slidesPerView: 6, spaceBetween: 30 },
                        1536: { slidesPerView: 6, spaceBetween: 32 },
                    }}
                    className="featured-category-swiper pb-10"
                >
                    {categories.map((cate) => (
                        <SwiperSlide key={cate?.id}>
                           <CategoryItem cate={cate} handleCategoryClick={handleCategoryClick} />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <button
                        onClick={() => router.get('/all-products')}
                        className="px-8 py-3 bg-red/20 border-2 font-mont border-red/50 text-cream font-bold rounded-full hover:bg-red hover:border-red hover:text-white transition-all duration-300 shadow-lg hover:shadow-red/50"
                    >
                        View All Categories
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeaturedCategory;
