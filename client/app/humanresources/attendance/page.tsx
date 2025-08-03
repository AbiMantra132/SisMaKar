"use client";

import { NavigationBar } from "../../../components/Navbar";
import { useEffect, useState } from "react";
import { fetchEmployeeCount } from "../../../utils/fetchEmployee";
import {
  fetchAttendanceSummary,
  fetchDetailedMonthAttendanceSummary,
  fetchAttendanceDepartementSummaryDaily,
  fetchEmployeeAttendance,
} from "../../../utils/fetchAttendance";
import {
  MonthlyAttendanceChart,
  AttendanceComparisonChart,
} from "../../../components/Chart";
import { fetchUserRole } from "../../../utils/fetchAuth";

export default function attendancePage() {
  const [totalEmployee, setTotalEmployee] = useState<number>(0);
  const [attendanceSummary, setAttendanceSummary] = useState({
    onTime: 0,
    absent: 0,
    lateArrival: 0,
    earlyDeparture: 0,
    timeOff: 0,
    leaveAmmount: 0,
    leaveTotal: 0,
  });
  const [detailedSummary, setDetailedSummary] = useState<
    Record<string, string>
  >({});
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const [filter, setFilter] = useState<{ startDate: string; endDate: string }>({
    startDate: startOfMonth.toISOString().split("T")[0],
    endDate: endOfMonth.toISOString().split("T")[0],
  });
  const [departmentAttendancePercentages, setDepartmentAttendancePercentages] =
    useState<Record<string, number>>({});
  const [comparisonStartDate, setComparisonStartDate] = useState<string>(
    filter.startDate
  );
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    fetchDetailedMonthAttendanceSummary({
      startDate: filter.startDate,
      endDate: filter.endDate,
    })
      .then((data) => setDetailedSummary(data))
      .catch(() => {});
  }, [filter.startDate, filter.endDate]);

  useEffect(() => {
    fetchAttendanceDepartementSummaryDaily({
      startDate: comparisonStartDate,
      endDate: comparisonStartDate,
    })
      .then((data) => setDepartmentAttendancePercentages(data))
      .catch(() => {});

    fetchEmployeeAttendance({
      startDate: comparisonStartDate,
      endDate: comparisonStartDate,
    })
      .then((data) => {
        setEmployees(data);
      })
      .catch(() => {});
  }, [comparisonStartDate]);

  function useRealTime() {
    const [time, setTime] = useState<string>("");
    const [date, setDate] = useState<string>("");

    useEffect(() => {
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];

      fetchUserRole().then((data) => {
        if (data && data.role) {
          console.log("User role:", data.role);
          if (data.role !== "HR") {
            window.location.href = `/${data.role.toLowerCase()}`;
          }
        } else {
          window.location.href = "/";
        }
      });

      fetchAttendanceSummary({
        startDate: formattedDate,
        endDate: formattedDate,
      })
        .then((data) => setAttendanceSummary(data))
        .catch(() => {});

      function updateTime() {
        const now = new Date();

        let hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        const formattedTime =
          [
            hours.toString().padStart(2, "0"),
            minutes.toString().padStart(2, "0"),
            seconds.toString().padStart(2, "0"),
          ].join(":") + ` ${ampm}`;
        setTime(formattedTime);

        const day = now.getDate();
        const month = now.toLocaleString("default", { month: "long" });
        const year = now.getFullYear();
        const daySuffix =
          day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th";
        setDate(`${day}${daySuffix} ${month} ${year}`);
      }

      fetchEmployeeCount().then((data) => {
        setTotalEmployee(data);
      });

      updateTime();
      const interval = setInterval(updateTime, 1000);
      return () => clearInterval(interval);
    }, []);

    return { time, date };
  }

  const { time, date } = useRealTime();
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
                {time}
              </div>
              <div className="text-lg mb-2">Today</div>
              <div className="text-2xl font-light">{date}</div>
            </div>
          </div>
          {/* Total Employees */}
          <div className="border border-1px border-contrast-color bg-white flex flex-col gap-2 p-7 rounded-2xl shadow-md justify-center">
            <div className="text-6xl font-light">{totalEmployee}</div>
            <div className="text-xl font-medium">Total Employees</div>
          </div>
          {/* On Time */}
          <div className="border border-1px border-contrast-color bg-white flex flex-col gap-2 p-7 rounded-2xl shadow-md justify-center">
            <div className="text-6xl font-light">
              {attendanceSummary.onTime}
            </div>
            <div className="text-xl font-medium">On Time</div>
          </div>
          {/* Absent */}
          <div className="border border-1px border-contrast-color bg-white flex flex-col gap-2 p-7 rounded-2xl shadow-md justify-center">
            <div className="text-6xl font-light">
              {attendanceSummary.absent}
            </div>
            <div className="text-xl font-medium">Absent</div>
          </div>
          {/* Late Arrival */}
          <div className="border border-1px border-contrast-color bg-white flex flex-col gap-2 p-7 rounded-2xl shadow-md justify-center">
            <div className="text-5xl font-light">
              {attendanceSummary.lateArrival}
            </div>
            <div className="text-lg font-medium">Late Arrival</div>
          </div>
          {/* Early Departures */}
          <div className="border border-1px border-contrast-color bg-white flex flex-col gap-2 p-7 rounded-2xl shadow-md justify-center">
            <div className="text-5xl font-light">
              {attendanceSummary.earlyDeparture}
            </div>
            <div className="text-lg font-medium">Early Departures</div>
          </div>
          {/* Time-Off */}
          <div className="border border-1px border-contrast-color bg-white flex flex-col gap-2 p-7 rounded-2xl shadow-md justify-center">
            <div className="text-5xl font-light">
              {attendanceSummary.timeOff}
            </div>
            <div className="text-lg font-medium">Time-Off</div>
          </div>
          {/* Monthly Attendance Chart */}
          <div className="col-span-2 row-span-2 row-start-3 bg-white border border-1px border-contrast-color rounded-2xl shadow-md p-8 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-lg">Monthly Attendance</span>
              <select
                className="text-gray-500 text-sm flex items-center gap-1 cursor-pointer bg-transparent outline-none"
                value={filter.startDate.slice(0, 7)}
                onChange={(e) => {
                  const [year, month] = e.target.value.split("-");
                  const start = new Date(Number(year), Number(month) - 1, 1);
                  const end = new Date(Number(year), Number(month), 0);
                  setFilter({
                    startDate: start.toISOString().split("T")[0],
                    endDate: end.toISOString().split("T")[0],
                  });
                }}
              >
                {Array.from({ length: 12 }).map((_, idx) => {
                  const date = new Date(today.getFullYear(), idx, 1);
                  const value = `${date.getFullYear()}-${(date.getMonth() + 1)
                    .toString()
                    .padStart(2, "0")}`;
                  const label = date.toLocaleString("default", {
                    month: "long",
                  });
                  return (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex items-center h-full">
              <div className="w-full h-full">
                <MonthlyAttendanceChart
                  data={[
                    { label: "IT", value: Number(detailedSummary?.IT || 0) },
                    { label: "HK", value: Number(detailedSummary?.HK || 0) },
                    {
                      label: "SALES",
                      value: Number(detailedSummary?.SALES || 0),
                    },
                    { label: "F&B", value: Number(detailedSummary?.FnB || 0) },
                    { label: "FO", value: Number(detailedSummary?.FO || 0) },
                    { label: "ENG", value: Number(detailedSummary?.ENG || 0) },
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
              <input
                type="date"
                className="text-gray-500 text-sm flex items-center gap-1 cursor-pointer bg-transparent outline-none border border-gray-300 rounded px-2 py-1"
                value={comparisonStartDate}
                max={filter.endDate}
                onChange={(e) => {
                  setComparisonStartDate(e.target.value);
                }}
              />
            </div>
            <div className="flex items-center h-full">
              <div className="w-full h-full pt-25">
                <AttendanceComparisonChart
                  data={[
                    {
                      label: "IT",
                      value: Number(departmentAttendancePercentages.IT) || 0,
                    },
                    {
                      label: "HK",
                      value: Number(departmentAttendancePercentages.HK) || 0,
                    },
                    {
                      label: "SALES",
                      value: Number(departmentAttendancePercentages.SALES) || 0,
                    },
                    {
                      label: "F&B",
                      value: Number(departmentAttendancePercentages.FnB) || 0,
                    },
                    {
                      label: "FO",
                      value: Number(departmentAttendancePercentages.FO) || 0,
                    },
                    {
                      label: "ENG",
                      value: Number(departmentAttendancePercentages.ENG) || 0,
                    },
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

      <div className="mt-20 w-full">
        <div className="flex items-center justify-between mt-10 mb-6 px-10">
          <div className="text-3xl font-bold text-contrast-color">
            Attendance Records
          </div>
        </div>
        <table className="w-[95%] mx-auto table-auto mt-8 rounded-3xl overflow-hidden bg-white">
          <thead>
            <tr className="text-contrast-color">
              <th className="py-6 px-3 text-center">Name</th>
              <th className="py-6 px-3 text-center">Checkin</th>
              <th className="py-6 px-3 text-center">Checkout</th>
              <th className="py-6 px-3 text-center">Work Hours</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400">
                  No attendance records found
                </td>
              </tr>
            ) : (
              employees.map((employee, index) => (
                <tr
                  key={employee.id || index}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors text-center"
                >
                  <td className="py-6 px-3 text-center">
                    {employee.fullName || "-"}
                  </td>
                  <td className="py-6 px-3 text-center">
                    {employee.attendance?.checkIn || "-"}
                  </td>
                  <td className="py-6 px-3 text-center">
                    {employee.attendance?.checkOut || "-"}
                  </td>
                  <td className="py-6 px-3 text-center">
                    {employee.attendance?.workHours ?? "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
