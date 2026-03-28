 

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { GoArrowRight } from "react-icons/go";
 

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Link } from '@inertiajs/react';

 

export default function Hero({sliders}) {
  return (
    <div className="px-4 sm:px-6 lg:px-20 xl:px-20 bg-dark1">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop
        className="w-full"
      >
        {sliders.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center py-8 sm:py-12 lg:py-[100px] gap-6">
                <div className="w-full flex justify-center items-center order-2 lg:order-1">
                                <img
                                    src={slide.banner && `/${slide.banner}`}
                                    alt={slide.title}
                                    loading="lazy"
                                    className="w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] xl:max-w-[600px] object-contain"
                                />
                            </div>
                            <div className="w-full order-1 lg:order-2 text-center lg:text-left px-4 sm:px-6 lg:px-0">
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-[100px] text-yellow font-mont  leading-tight sm:leading-snug lg:leading-[1.2] mb-6 sm:mb-8">
                                    {slide.type}
                                </h2>
                                <p className="text-cream text-sm sm:text-base lg:text-lg font-light mb-6  sm:mb-8 max-w-[90%] sm:max-w-[470px] mx-auto lg:mx-0 font-mont">
                                    {slide.title ||
                                        "Handcrafted with precision and timeless detail."}
                                </p>
                                <Link
                                    href={slide.btn_url}
                                    className="inline-flex items-center gap-2 text-sm sm:text-base  font-mont lg:text-lg px-6 sm:px-8 py-3 rounded-[10px] text-cream"
                                    variant="border"
                                    color="cream"
                                    size="md"
                                >
                                    Buy Products
                                    <GoArrowRight />
                                </Link>
                            </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}