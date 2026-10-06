"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";

export default function UniversalSlider({ items = [], renderItem, slidesPerView = 2, spaceBetween = 16, breakpoints, className = "" }) {
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  if (!items?.length) return null;

  const updateNavigation = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
    setActivePage(swiper.snapIndex);
    setPageCount(swiper.snapGrid.length);
  };

  return (
    <div className={`relative overflow-hidden py-10 ${className}`}>
      <Swiper
        modules={[Navigation]}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        breakpoints={breakpoints}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          updateNavigation(swiper);
        }}
        onSlideChange={updateNavigation}
        onResize={updateNavigation}
        className="!overflow-visible"
      >
        {items.map((item, index) => (
          <SwiperSlide key={item?._id || item?.id || index}>
            {renderItem(item, index)}
          </SwiperSlide>
        ))}
      </Swiper>
      {!isBeginning && (
        <button type="button" aria-label="قبلی" onClick={() => swiperRef.current?.slidePrev()} className="group absolute right-2 top-[46%] z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border border-coffee-200/60 bg-white/80 text-coffee-600 shadow-md shadow-coffee-900/10 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-coffee-500 hover:text-white dark:border-coffee-700/60 dark:bg-coffee-900/70 dark:text-coffee-200 dark:hover:bg-coffee-500 dark:hover:text-white md:flex">
          <ChevronRight size={19} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </button>
      )}

      {!isEnd && (
        <button type="button" aria-label="بعدی" onClick={() => swiperRef.current?.slideNext()} className="group absolute left-2 top-[46%] z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-2xl border border-coffee-200/60 bg-white/80 text-coffee-600 shadow-md shadow-coffee-900/10 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-coffee-500 hover:text-white dark:border-coffee-700/60 dark:bg-coffee-900/70 dark:text-coffee-200 dark:hover:bg-coffee-500 dark:hover:text-white md:flex">
          <ChevronLeft size={19} strokeWidth={2} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
        </button>
      )}
      {pageCount > 1 && (
        <div className="mt-7 flex items-center justify-center gap-1.5">
          {Array.from({ length: pageCount }).map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`رفتن به صفحه ${index + 1}`}
              onClick={() => swiperRef.current?.slideTo(swiperRef.current.snapGrid[index] ? swiperRef.current.slidesGrid.indexOf(swiperRef.current.snapGrid[index]) : index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${activePage === index ? "w-6 bg-coffee-500 dark:bg-coffee-400" : "w-1.5 bg-coffee-200 hover:bg-coffee-300 dark:bg-coffee-700 dark:hover:bg-coffee-600"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}