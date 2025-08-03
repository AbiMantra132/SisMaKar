"use client";
import { NavigationBar } from "../../../components/Navbar";
import EmailIcon from "@mui/icons-material/Email";
import { useState, useEffect } from "react";
import {
  fetchAllEmployees,
  fetchEmployeesByDepartment,
  fetchEmployeesByStatus,
} from "../../../utils/fetchEmployee";
import { fetchUserRole } from "../../../utils/fetchAuth";

export default function dashboardHRPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [department, setDepartment] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [editEmployee, setEditEmployee] = useState<any>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
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
      try {
        let data;
        if (department) {
          data = await fetchEmployeesByDepartment(department, page);
        } else if (status) {
          data = await fetchEmployeesByStatus(status, page);
        } else {
          data = await fetchAllEmployees(page);
        }

        console.log(data.data);
        setEmployees(data.data || []);
      } catch (err) {
        setError("Failed to fetch employees");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [page, department, status]);

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartment(e.target.value);
    setStatus("");
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // The filtering is already handled by filteredEmployees
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (status === "" ||
        (status === "PERMANENT" &&
          employee.position === "PERMANENT EMPLOYEE") ||
        (status === "CONTRACT" && employee.position === "CONTRACT EMPLOYEE") ||
        (status === "DAILY" && employee.position === "DAILY WORKER") ||
        (status === "INTERN" && employee.position === "INTERNSHIP/TRAINEE"))
  );

  const calculatePercentageChange = (position: string) => {
    // Simulate previous month counts based on current counts for demo purposes
    const previousMonthCounts: Record<string, number> = {
      "PERMANENT EMPLOYEE":
        employees.filter((emp) => emp.position === "PERMANENT EMPLOYEE")
          .length * 0.9,
      "CONTRACT EMPLOYEE":
        employees.filter((emp) => emp.position === "CONTRACT EMPLOYEE").length *
        1.1,
      "DAILY WORKER":
        employees.filter((emp) => emp.position === "DAILY WORKER").length *
        0.95,
      "INTERNSHIP/TRAINEE":
        employees.filter((emp) => emp.position === "INTERNSHIP/TRAINEE")
          .length * 1.05,
    };

    const currentCount = employees.filter(
      (emp) => emp.position === position
    ).length;
    const previousCount = previousMonthCounts[position] || 0;

    if (previousCount === 0) {
      return currentCount > 0 ? 100 : 0;
    }

    const percentageChange =
      ((currentCount - previousCount) / previousCount) * 100;
    return Math.round(percentageChange);
  };

  return (
    <div className="relative">
      <div className="font-poppins scale-80 -mt-20">
        <NavigationBar accountName="Human Resources" />
        <div className="flex items-center justify-between mt-30">
          <div className="flex flex-col items-start">
            <h3 className="text-primary-color">
              Sense Sunset Seminyak Employee Management System
            </h3>
            <h1 className="font-bold text-4xl text-contrast-color">
              Welcome, Human Resources
            </h1>
          </div>
          <div>
            <EmailIcon
              sx={{ fontSize: "5rem" }}
              className="text-contrast-color"
              onClick={() => {
                window.location.href = `/humanresources/notification`;
              }}
            />
          </div>
        </div>
        <div className="flex justify-between items-center mt-10 border-[1px] p-10 rounded-3xl border-contrast-color">
          <div className="flex flex-col items-start justify-center p-10 gap-5 relative after:content-[''] after:block after:w-[1px] after:h-full after:-right-[8.5rem] after:absolute after:bg-contrast-color after:rounded-lg">
            <p>Permanent Employees</p>
            <h2 className="text-7xl font-bold text-contrast-color">
              {
                employees.filter((emp) => emp.position === "PERMANENT EMPLOYEE")
                  .length
              }
            </h2>
            <p>
              {calculatePercentageChange("PERMANENT EMPLOYEE") > 0 ? (
                <span className="text-success-color">
                  {Math.abs(calculatePercentageChange("PERMANENT EMPLOYEE"))}%
                </span>
              ) : calculatePercentageChange("PERMANENT EMPLOYEE") < 0 ? (
                <span className="text-error-color">
                  {Math.abs(calculatePercentageChange("PERMANENT EMPLOYEE"))}%
                </span>
              ) : (
                <span>0%</span>
              )}{" "}
              {calculatePercentageChange("PERMANENT EMPLOYEE") > 0
                ? "more"
                : "less"}{" "}
              than Last Month
            </p>
          </div>
          <div className="flex flex-col items-start justify-center p-10 gap-5 relative after:content-[''] after:block after:w-[1px] after:h-full after:-right-[8.5rem] after:absolute after:bg-contrast-color after:rounded-lg">
            <p>Contract Employees</p>
            <h2 className="text-7xl font-bold text-contrast-color">
              {
                employees.filter((emp) => emp.position === "CONTRACT EMPLOYEE")
                  .length
              }
            </h2>
            <p>
              {calculatePercentageChange("CONTRACT EMPLOYEE") > 0 ? (
                <span className="text-success-color">
                  {Math.abs(calculatePercentageChange("CONTRACT EMPLOYEE"))}%
                </span>
              ) : calculatePercentageChange("CONTRACT EMPLOYEE") < 0 ? (
                <span className="text-error-color">
                  {Math.abs(calculatePercentageChange("CONTRACT EMPLOYEE"))}%
                </span>
              ) : (
                <span>0%</span>
              )}{" "}
              {calculatePercentageChange("CONTRACT EMPLOYEE") > 0
                ? "more"
                : "less"}{" "}
              than Last Month
            </p>
          </div>
          <div className="flex flex-col items-start justify-center p-10 gap-5 relative after:content-[''] after:block after:w-[1px] after:h-full after:-right-[8.5rem] after:absolute after:bg-contrast-color after:rounded-lg">
            <p>Daily Workers</p>
            <h2 className="text-7xl font-bold text-contrast-color">
              {
                employees.filter((emp) => emp.position === "DAILY WORKER")
                  .length
              }
            </h2>
            <p>
              {calculatePercentageChange("DAILY WORKER") > 0 ? (
                <span className="text-success-color">
                  {Math.abs(calculatePercentageChange("DAILY WORKER"))}%
                </span>
              ) : calculatePercentageChange("DAILY WORKER") < 0 ? (
                <span className="text-error-color">
                  {Math.abs(calculatePercentageChange("DAILY WORKER"))}%
                </span>
              ) : (
                <span>0%</span>
              )}{" "}
              {calculatePercentageChange("DAILY WORKER") > 0 ? "more" : "less"}{" "}
              than Last Month
            </p>
          </div>
          <div className="flex flex-col items-start justify-center p-10 gap-5">
            <p>Training / Internship</p>
            <h2 className="text-7xl font-bold text-contrast-color">
              {
                employees.filter((emp) => emp.position === "INTERNSHIP/TRAINEE")
                  .length
              }
            </h2>
            <p>
              {calculatePercentageChange("INTERNSHIP/TRAINEE") > 0 ? (
                <span className="text-success-color">
                  {Math.abs(calculatePercentageChange("INTERNSHIP/TRAINEE"))}%
                </span>
              ) : calculatePercentageChange("INTERNSHIP/TRAINEE") < 0 ? (
                <span className="text-error-color">
                  {Math.abs(calculatePercentageChange("INTERNSHIP/TRAINEE"))}%
                </span>
              ) : (
                <span>0%</span>
              )}{" "}
              {calculatePercentageChange("INTERNSHIP/TRAINEE") > 0
                ? "more"
                : "less"}{" "}
              than Last Month
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center mt-10 gap-8">
          <button className="text-contrast-color bg-gray-200 px-8 py-3 rounded-xl font-semibold shadow hover:bg-gray-300 transition-colors duration-200">
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
          <button
            className="text-primary-color bg-orange-100 px-8 py-3 rounded-xl font-semibold shadow hover:bg-orange-200 transition-colors duration-200"
            onClick={() => {
              window.location.href = "/humanresources/attendance";
            }}
          >
            Attendance
          </button>
        </div>

        <div className="flex gap-4 mt-10 w-[50%]">
          <form onSubmit={handleSearch} className="w-full">
            <input
              type="text"
              placeholder="Search employee"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-primary-color"
            />
          </form>
          <div className="flex items-center gap-2 w-[30rem]">
            <select
              value={department}
              onChange={handleDepartmentChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-primary-color"
            >
              <option value="">Select Department</option>
              <option value="IT">IT</option>
              <option value="HK">HK</option>
              <option value="ACC">ACC</option>
              <option value="FB">FB</option>
              <option value="SALES">SALES</option>
              <option value="ENG">ENG</option>
              <option value="FO">FO</option>
            </select>
          </div>
        </div>
        <table className="w-full table-auto mt-20">
          <thead>
            <tr className="text-contrast-color">
              <th>Name</th>
              <th>Role</th>
              <th>Department</th>
              <th>Phone Number</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-error-color">
                  {error}
                </td>
              </tr>
            ) : filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  No employees found
                </td>
              </tr>
            ) : (
              filteredEmployees.map((employee) => (
                <tr
                  key={employee.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors text-center my-2"
                >
                  <td className="py-6 px-3 text-center">{`${employee.fullName}`}</td>
                  <td className="py-6 px-3 text-center">{employee.position}</td>
                  <td className="py-6 px-3 text-center">
                    <span className="bg-orange-100 text-contrast-color px-3 py-1 rounded-full text-sm">
                      {employee.departmentName}
                    </span>
                  </td>
                  <td className="py-6 px-3 text-center">
                    {employee.phoneNumber}
                  </td>
                  <td className="py-6 px-3 text-center">
                    <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-contrast-color">
                      {employee.position}
                    </span>
                  </td>
                  <td className="py-6 px-3 text-center">
                    <button
                      className="bg-primary-color text-white px-4 py-1 rounded-lg mr-2 hover:opacity-90 transition-opacity"
                      onClick={() =>
                        (window.location.href = `/employees/${employee.id}`)
                      }
                    >
                      View
                    </button>
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
