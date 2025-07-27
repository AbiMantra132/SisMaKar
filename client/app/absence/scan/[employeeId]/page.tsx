"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

// Dynamically import html5-qrcode to avoid SSR issues
const Html5QrcodeScannerComponent: React.FC<{
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (error: string) => void;
}> = ({ onScanSuccess, onScanFailure }) => {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [scanner, setScanner] = useState<any>(null);

  useEffect(() => {
    let html5QrcodeScanner: any;
    let isMounted = true;

    import("html5-qrcode").then(({ Html5QrcodeScanner }) => {
      if (!isMounted) return;
      html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: 250, supportedScanTypes: [] },
        false
      );
      html5QrcodeScanner.render(
        (decodedText: string) => {
          onScanSuccess(decodedText);
        },
        (error: string) => {
          if (onScanFailure) onScanFailure(error);
        }
      );
      setScanner(html5QrcodeScanner);
    });

    return () => {
      isMounted = false;
      if (scanner) {
        scanner.clear().catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div id="reader" ref={scannerRef} />;
};

const ScanPage: React.FC = () => {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const employeeId = params?.employeeId as string;

  const handleScanSuccess = async (decodedText: string) => {
    setResult(decodedText);
    setLoading(true);
    try {
      await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId,
          scannedData: decodedText,
          timestamp: Date.now(),
        }),
      });
    } catch (error) {
      // handle error if needed
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>QR Code Scanner</h1>
      {!result && (
        <Html5QrcodeScannerComponent
          onScanSuccess={handleScanSuccess}
        />
      )}
      {result && (
        <div
          style={{
            marginTop: 24,
            padding: 16,
            border: "1px solid #ccc",
            borderRadius: 8,
            background: "#fafafa",
            maxWidth: 400,
          }}
        >
          <h2 style={{ marginBottom: 8 }}>Scan Result:</h2>
          <p style={{ wordBreak: "break-all", marginBottom: 16 }}>{result}</p>
          {loading ? (
            <p>Sending data...</p>
          ) : (
            <button
              style={{
                padding: "8px 16px",
                border: "none",
                borderRadius: 4,
                background: "#0070f3",
                color: "#fff",
                cursor: "pointer",
              }}
              onClick={() => setResult(null)}
            >
              Scan Again
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ScanPage;
