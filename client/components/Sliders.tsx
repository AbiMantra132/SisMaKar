"use client";

import React from "react";
import Image from "next/image";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";

interface ContentProps {
  content: { image: string }[];
}

export const Sliders = ({ content }: ContentProps) => {
  return (
    <Swiper
      spaceBetween={30}
      slidesPerView={1.3}
      pagination={{ clickable: true }}
      loop={true}
      initialSlide={1}
      centeredSlides
      grabCursor
      speed={800}
      slideToClickedSlide
    >
      {content.length > 0 &&
        content.map((item, index) => {
          return (
            <SwiperSlide key={index}>
              <Image
                src={item.image}
                alt={`Slide ${index + 1}`}
                width={1920}
                height={1080}
              />
            </SwiperSlide>
          );
        })}
    </Swiper>
  );
};
