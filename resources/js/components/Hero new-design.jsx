'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { Link } from '@inertiajs/react';

const slides = [
  {
    id: 1,
    image: '/api/placeholder/1200/600', // Replace with your actual image URL
    title: 'Where Craft Meets Elegance',
    subtitle: 'Handcrafted with precision and timeless detail.',
    description: 'Luxury materials meet modern minimalism.',
    buttonText: 'Buy Products',
  },
    {
    id: 1,
    image: '/api/placeholder/1200/600', // Replace with your actual image URL
    title: 'Where Craft Meets Elegance',
    subtitle: 'Handcrafted with precision and timeless detail.',
    description: 'Luxury materials meet modern minimalism.',
    buttonText: 'Buy Products',
  },
    {
    id: 1,
    image: '/api/placeholder/1200/600', // Replace with your actual image URL
    title: 'Where Craft Meets Elegance',
    subtitle: 'Handcrafted with precision and timeless detail.',
    description: 'Luxury materials meet modern minimalism.',
    buttonText: 'Buy Products',
  },
 
];

export default function HeroSlider({sliders}) {
  console.log("sliders", sliders);
  return (
    <div className='bg-dark1'>

    
    <Swiper
      modules={[Autoplay, Pagination]}
      spaceBetween={0}
      slidesPerView={1}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      loop={true}
      className="w-full h-screen max-h-screen"
    >
      {sliders.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className="relative w-full h-full">
            {/* Background Image */}
             

            {/* Content */}
            <div className="relative h-full flex items-center justify-between px-6 md:px-12 lg:px-24 xl:px-32 gap-30">
              {/* Left: Model with Tote Bag */}
              <div className="w-full md:w-1/2 lg:w-2/5 flex justify-center">
                <div className="relative">
                  {/* Replace this with your actual model image */}
                  <div className="w-64 md:w-80 lg:w-96 aspect-square   rounded-lg   flex items-center justify-center">
                     <img src={slide.banner} alt="" />
                  </div>
                </div>
              </div>

              {/* Right: Text Content */}
              <div className="w-full md:w-1/2 lg:w-3/5 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-5xl  font-bold text-yellow leading-tight mb-6 font-mont">
                 {slide.type}
                </h1>
                
                <p className="text-base md:text-lg lg:text-xl text-white/90 mb-10">
                  {slide.title}
                </p>
                <Link href={`${slide.btn_url}`} className="bg-yellow   inline-flex items-center hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-full text-lg md:text-xl transition duration-300 flex items-center gap-3 mx-auto md:mx-0">
                  Explore
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
    </div>
  );
}