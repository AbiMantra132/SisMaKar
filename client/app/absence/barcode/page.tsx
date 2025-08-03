"use client";
import JsBarcode from "jsbarcode";
import React, { useEffect, useRef } from "react";
import Logo from "../../../public/Logo.png";
import Image from "next/image";

const Barcode: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const simpleDate = `${year}${month}${day}`;
      JsBarcode(svgRef.current, simpleDate, {
        format: "CODE128",
        lineColor: "#000",
        width: 2,
        height: 60,
      });
    }
  }, []);

  return (
    <div className="scale-90 flex flex-col items-center justify-center font-poppins overflow-hidden h-screen">
      <div>
        <Image src={Logo} alt="Logo" className="scale-[65%]" />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          scale: "200%"
        }}
        className="-mt-[10rem]"
      >
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default Barcode;
