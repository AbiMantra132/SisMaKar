"use client";

import Image from "next/image";
import Logo from "../public/Logo.png";
import { PrimaryButton } from "../components/Button";
import { Sliders } from "../components/Sliders";

import Slide1Image from "../public/sliders/landing/slide-1.jpg";
import Slide2Image from "../public/sliders/landing/slide-2.jpg";
import Slide3Image from "../public/sliders/landing/slide-3.jpg";

const sliderContent = [
  { image: Slide1Image.src },
  { image: Slide2Image.src },
  { image: Slide3Image.src },
  { image: Slide1Image.src },
  { image: Slide2Image.src },
  { image: Slide3Image.src },
  { image: Slide1Image.src },
  { image: Slide2Image.src },
  { image: Slide3Image.src },
];

export default function Home() {
  return (
    <div className="scale-90 flex flex-col items-center justify-center font-poppins">
      <div className="flex flex-col items-center justify-center max-w-[35%] h-[500px]">
        <Image src={Logo} alt="Logo" className="scale-[65%]" />
        <div className="font-poppins text-2xl before:content-[''] relative before:-bottom-[18px] before:block before:w-full before:h-4 before:bg-primary-color before:rounded-lg before:mb-4 before:opacity-30 before:absolute px-1 before:-mx-1 text-center">
          Employee Management System
        </div>
        <div className="text-5xl text-primary-color mt-4">
          Sense Sunset Seminyak
        </div>
        <div>
          <p className="text-center font-medium text-md mt-4">
            Welcome to the Employee Management System of Sense Sunset Seminyak.
            This system is designed to streamline employee management processes,
            enhance communication, and improve overall efficiency.
          </p>
        </div>
        <div className="scale-120 mt-10">
          <PrimaryButton title="Sign In" path="/login" />
        </div>
      </div>
      <div className="my-10 w-[80%] h-[45rem] relative overflow-hidden flex justify-center items-center">
        <Sliders content={sliderContent} />
      </div>
    </div>
  );
}
