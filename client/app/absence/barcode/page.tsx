'use client';
import JsBarcode from 'jsbarcode';
import React, { useEffect, useRef } from 'react';



const Barcode: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      JsBarcode(svgRef.current, new Date().toISOString(), {
        format: 'CODE128',
        lineColor: '#000',
        width: 2,
        height: 60,
        displayValue: true,
      });
    }
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default Barcode;