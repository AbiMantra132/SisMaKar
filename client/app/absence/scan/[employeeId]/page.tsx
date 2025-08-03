"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { fetchCompleteProfile } from "../../../../utils/fetchProfile";
import { fetchUserRole } from "../../../../utils/fetchAuth";
import { createAbsence } from "../../../../utils/fetchAttendance";

const Html5QrcodeScannerComponent: React.FC<{
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (error: string) => void;
}> = ({ onScanSuccess, onScanFailure }) => {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [scanner, setScanner] = useState<any>(null);

  useEffect(() => {
    fetchUserRole().then((data) => {
      // if (data && data.role) {
      //   console.log("User role:", data.role);
      //   if (
      //     data.role !== "HR" ||
      //     data.role !== "HEAD" ||
      //     data.role !== "ADMIN" ||
      //     data.role !== "EMPLOYEE"
      //   ) {
      //     window.location.href = "/";
      //   }
      // } else {
      //   window.location.href = "/";
      // }
    });
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
  }, []);

  return <div id="reader" ref={scannerRef} />;
};

const ScanPage: React.FC = () => {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [employeeProfile, setEmployeeProfile] = useState<any>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const params = useParams();
  const employeeId = params?.employeeId as string;

  useEffect(() => {
    if (employeeId) {
      fetchCompleteProfile(Number(employeeId))
        .then((profile) => {
          setEmployeeProfile(profile);
          setProfileError(null);
          console.log("Employee profile:", profile);
        })
        .catch((error) => {
          setProfileError("Failed to fetch employee profile");
          console.error("Failed to fetch employee profile:", error);
        });
    }
  }, [employeeId]);

  const handleScanSuccess = async (decodedText: string) => {
    setResult(decodedText);
    setLoading(true);
    try {
      const today = new Date();
      const dateString = today.toISOString().split("T")[0]; 

      const absenceRes = await fetch(`http://localhost:4001/absence/get-absence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Number(employeeId),
          date: dateString,
        }),
      });

      const absenceData = await absenceRes.json();

      if (!absenceData) {
        const data = await createAbsence({
          userId: Number(employeeId),
          date: today,
          reason: "QR Scan",
          checkin: Date.now(),
        });

        console.log("Checkin response:", data);
      } else {
        await createAbsence({
          userId: Number(employeeId),
          date: today,
          reason: "QR Scan",
          checkin: Date.now(),
        });
      }
    } catch (error) {
      setProfileError("Failed to send scan data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md flex flex-col items-center">
        <p className="text-xs text-[#F7931E] mb-2 text-center">
          Sense Sunset Seminyak Employee Management System
        </p>
        <h1 className="text-2xl font-bold mb-4 text-black text-center">
          Absence Scan
        </h1>
        <div className="w-full flex justify-center">
          {!result && (
            <div className="p-2 bg-white rounded-lg border-4 border-[#F7931E]">
              <div className="w-[400px] h-[400px] flex items-center justify-center bg-white">
                <Html5QrcodeScannerComponent
                  onScanSuccess={handleScanSuccess}
                />
              </div>
            </div>
          )}
        </div>
        {result && (
          <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-50 w-full max-w-md flex flex-col items-center">
            <h2 className="mb-2 text-lg font-semibold text-black text-center">
              Scan Result:
            </h2>
            <p className="break-all mb-4 text-center text-black">{result}</p>
            {loading ? (
              <p className="text-[#F7931E] text-center">Sending data...</p>
            ) : (
              <button
                className="px-4 py-2 rounded bg-[#F7931E] text-white font-medium hover:bg-[#e67c13] transition-colors block mx-auto"
                onClick={() => setResult(null)}
              >
                Scan Again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanPage;
