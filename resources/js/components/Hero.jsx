import React, { useEffect, useState } from "react";
import { GoArrowRight } from "react-icons/go";
import { Link } from "@inertiajs/react";

// Standard Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Required CSS imports
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Hero = ({ sliders }) => {
  const [isClient, setIsClient] = useState(false);

  // Simple hydration check to avoid SSR mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render Swiper during SSR or before mount
  if (!isClient || !sliders?.length) {
    return null; // or return <div className="h-64 bg-dark1" /> as placeholder
  }

  return (
    <div className="bg-dark1">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        speed={1000}
        pagination={{ clickable: true }}
        navigation={true}
        className="w-full my-swiper-hero"
      >
        {sliders.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="px-4 sm:px-6 lg:px-10 xl:px-20 max-w-[1200px] mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 items-center py-8 sm:py-12 lg:py-4 2xl:py-10 gap-6">
                {/* Image */}
                <div className="w-full flex justify-center items-center order-2 lg:order-1">
                  <img
                    src={slide.banner ? `/${slide.banner}` : "/placeholder-banner.jpg"}
                    alt={slide.title || "Slider image"}
                    loading={index === 0 ? "eager" : "lazy"}
                    className="w-full max-w-[300px] sm:max-w-[400px] lg:w-full lg:max-w-[300px] xl:w-full 2xl:max-w-[500px] object-contain drop-shadow-2xl"
                  />
                </div>

                {/* Text */}
                <div className="w-full order-1 lg:order-2 text-center lg:text-left px-4 sm:px-6 lg:px-0">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-6xl text-yellow font-mont font-normal leading-tight sm:leading-snug lg:leading-[1.1] mb-6 sm:mb-8">
                    {slide.type}
                  </h2>
                  <p className="text-cream text-sm sm:text-base lg:text-lg xl:text-xl font-light mb-6 sm:mb-8 max-w-[90%] sm:max-w-[470px] mx-auto lg:mx-0 font-mont">
                    {slide.title}
                  </p>

                  {slide.btn_url && (
                    <Link
                      href={slide.btn_url}
                      className="inline-flex items-center gap-3 text-sm sm:text-base lg:text-lg font-mont px-6 sm:px-8 py-3 rounded-[10px] border-2 bg-red text-cream border-red transition-all duration-300 hover:bg-transparent hover:text-red"
                    >
                      Buy Products
                      <GoArrowRight className="text-xl" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Hero;