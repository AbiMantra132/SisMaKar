"use client";

import { NavigationBar } from "../../../components/Navbar";
import EmailIcon from "@mui/icons-material/Email";
import { PrimaryButton } from "../../../components/Button";
import {
  MonthlyAttendanceChart,
  AttendanceComparisonChart,
} from "../../../components/Chart";

export default function attendancePage() {
  return (
    <div className="font-poppins scale-80 -mt-20">
      <NavigationBar accountName="Human Resources" />
      <div className="flex justify-center items-center mt-20">
        <div className="grid grid-cols-4 grid-rows-4 gap-8 w-[90%] mx-auto text-contrast-color">
          {/* Real Time Insight */}
          <div className="row-span-2 col-span-1 bg-white border border-1px border-contrast-color rounded-2xl shadow-md flex flex-col justify-center p-8 min-h-[320px]">
            <div>
              <div className="text-lg font-semibold mb-4">
                Real Time Insight
              </div>
              <div
                className="text-5xl font-light tracking-tight mb-6"
                id="clock"
              >
                08:02:09 AM
              </div>
              <div className="text-lg mb-2">Today</div>
              <div className="text-2xl font-light">2nd August 2025</div>
            </div>
          </div>
          {/* Total Employees */}
          <div className="border border-1px border-contrast-color bg-white flex flex-col gap-2 p-7 rounded-2xl shadow-md justify-center">
            <div className="text-6xl font-light">452</div>
            <div className="text-xl font-medium">Total Employees</div>
            <div className="flex items-center gap-2 mt-2 text-success-color text-sm">
              <span className="bg-success-color/10 rounded-full p-1">
                <svg width="18" height="18" fill="none">
                  <circle cx="9" cy="9" r="9" fill="#4CAF50" />
                  <path
                    d="M9 5v6m0 0l3-3m-3 3l-3-3"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              2 New Employees Added!
            </div>
          </div>
          {/* On Time */}
          <div className="border border-1px border-contrast-color bg-white flex flex-col gap-2 p-7 rounded-2xl shadow-md justify-center">
            <div className="text-6xl font-light">280</div>
            <div className="text-xl font-medium">On Time</div>
            <div className="flex items-center gap-2 mt-2 text-success-color text-sm">
              <span className="bg-success-color/10 rounded-full p-1">
                <svg width="18" height="18" fill="none">
                  <circle cx="9" cy="9" r="9" fill="#4CAF50" />
                  <path
                    d="M9 5v6m0 0l3-3m-3 3l-3-3"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              10% Less Than Yesterday
            </div>
          </div>
          {/* Absent */}
          <div className="border border-1px border-contrast-color bg-white flex flex-col gap-2 p-7 rounded-2xl shadow-md justify-center">
            <div className="text-6xl font-light">30</div>
            <div className="text-xl font-medium">Absent</div>
            <div className="flex items-center gap-2 mt-2 text-error-color text-sm">
              <span className="bg-error-color/10 rounded-full p-1">
                <svg width="18" height="18" fill="none">
                  <circle cx="9" cy="9" r="9" fill="#F44336" />
                  <path
                    d="M9 13V7m0 0l-3 3m3-3l3 3"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              10% More Than Yesterday
            </div>
          </div>
          {/* Late Arrival */}
          <div className="border border-1px border-contrast-color bg-white flex flex-col gap-2 p-7 rounded-2xl shadow-md justify-center">
            <div className="text-5xl font-light">29</div>
            <div className="text-lg font-medium">Late Arrival</div>
            <div className="flex items-center gap-2 mt-2 text-success-color text-sm">
              <span className="bg-success-color/10 rounded-full p-1">
                <svg width="18" height="18" fill="none">
                  <circle cx="9" cy="9" r="9" fill="#4CAF50" />
                  <path
                    d="M9 5v6m0 0l3-3m-3 3l-3-3"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              3% Less Than Yesterday
            </div>
          </div>
          {/* Early Departures */}
          <div className="border border-1px border-contrast-color bg-white flex flex-col gap-2 p-7 rounded-2xl shadow-md justify-center">
            <div className="text-5xl font-light">32</div>
            <div className="text-lg font-medium">Early Departures</div>
            <div className="flex items-center gap-2 mt-2 text-success-color text-sm">
              <span className="bg-success-color/10 rounded-full p-1">
                <svg width="18" height="18" fill="none">
                  <circle cx="9" cy="9" r="9" fill="#4CAF50" />
                  <path
                    d="M9 5v6m0 0l3-3m-3 3l-3-3"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              3% Less Than Yesterday
            </div>
          </div>
          {/* Time-Off */}
          <div className="border border-1px border-contrast-color bg-white flex flex-col gap-2 p-7 rounded-2xl shadow-md justify-center">
            <div className="text-5xl font-light">42</div>
            <div className="text-lg font-medium">Time-Off</div>
            <div className="flex items-center gap-2 mt-2 text-success-color text-sm">
              <span className="bg-success-color/10 rounded-full p-1">
                <svg width="18" height="18" fill="none">
                  <circle cx="9" cy="9" r="9" fill="#4CAF50" />
                  <path
                    d="M9 5v6m0 0l3-3m-3 3l-3-3"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              3% Less Than Yesterday
            </div>
          </div>
          {/* Monthly Attendance Chart */}
          <div className="col-span-2 row-span-2 row-start-3 bg-white border border-1px border-contrast-color rounded-2xl shadow-md p-8 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-lg">Monthly Attendance</span>
              <span className="text-gray-500 text-sm flex items-center gap-1 cursor-pointer">
                March
                <svg width="16" height="16" fill="none">
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="#404040"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
            <div className="flex items-center h-full">
              <div className="w-full h-full">
                <MonthlyAttendanceChart
                  data={[
                    { label: "IT", value: 75 },
                    { label: "HK", value: 60 },
                    { label: "SALES", value: 85 },
                    { label: "F&B", value: 70 },
                    { label: "FO", value: 90 },
                    { label: "ENG", value: 65 },
                  ]}
                />
              </div>
            </div>
          </div>
          {/* Attendance Comparison Chart */}
          <div className="col-span-2 row-span-2 col-start-3 row-start-3 bg-white border border-1px border-contrast-color rounded-2xl shadow-md p-8 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-lg">
                Attendance Comparison Chart
              </span>
              <span className="text-gray-500 text-sm flex items-center gap-1 cursor-pointer">
                Daily
                <svg width="16" height="16" fill="none">
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="#404040"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
            <div className="flex items-center h-full">
              <div className="w-full h-full pt-25">
                <AttendanceComparisonChart
                  data={[
                    { label: "IT", value: 75 },
                    { label: "HK", value: 60 },
                    { label: "SALES", value: 85 },
                    { label: "F&B", value: 70 },
                    { label: "FO", value: 90 },
                    { label: "ENG", value: 65 },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center mt-10 gap-8">
        <button
          className="text-primary-color bg-orange-100 px-8 py-3 rounded-xl font-semibold shadow hover:bg-orange-200 transition-colors duration-200"
          onClick={() => {
            window.location.href = "/humanresources/dashboard";
          }}
        >
          Employee
        </button>
        <button
          className="text-primary-color bg-orange-100 px-8 py-3 rounded-xl font-semibold shadow hover:bg-orange-200 transition-colors duration-200"
          onClick={() => {
            window.location.href = "/humanresources/annualleave";
          }}
        >
          Annual Leave
        </button>
        <button className="text-contrast-color bg-gray-200 px-8 py-3 rounded-xl font-semibold shadow hover:bg-gray-300 transition-colors duration-200">
          Attendance
        </button>
      </div>

      <table className="w-full table-auto mt-30">
        <thead>
          <tr className="text-contrast-color">
            <th>Name</th>
            <th>Checkin</th>
            <th>Checkout</th>
            <th>Work Hours</th>
            <th>Status</th>
          </tr>
        </thead>
      </table>
    </div>
  );
}
