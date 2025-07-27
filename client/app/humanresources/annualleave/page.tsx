"use client";
import {
  fetchAllEmployees,
  fetchEmployeesByDepartment,
  fetchEmployeesByStatus,
} from "../../../utils/fetchEmployee";
import { useState, useEffect } from "react";
import { NavigationBar } from "../../../components/Navbar";
import EmailIcon from "@mui/icons-material/Email";

export default function AnnualleavePage() {
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
            />
          </div>
        </div>
        <div className="w-full h-[30rem] bg-primary-color mt-10 rounded-4xl shadow-sm"></div>
        <div className="flex items-center justify-center mt-10 gap-8">
          <button
            className="text-primary-color bg-orange-100 px-8 py-3 rounded-xl font-semibold shadow hover:bg-orange-200 transition-colors duration-200"
            onClick={() => {
              window.location.href = "/humanresources/dashboard";
            }}
          >
            Employee
          </button>
          <button className="text-contrast-color bg-gray-200 px-8 py-3 rounded-xl font-semibold shadow hover:bg-gray-300 transition-colors duration-200">
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
              <th>Date</th>
              <th>Leave Amount</th>
              <th>Total</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-error-color">
                  {error}
                </td>
              </tr>
            ) : filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6">
                  No employees found
                </td>
              </tr>
            ) : (
              filteredEmployees.map((employee) => (
                <tr
                  key={employee.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors text-center my-2"
                >
                  <td className="py-6 px-3 text-center">
                    {employee.fullName || "-"}
                  </td>
                  <td className="py-6 px-3 text-center">
                    {/* Replace with actual leave date */}
                    {employee.leaveDate || "-"}
                  </td>
                  <td className="py-6 px-3 text-center">
                    {/* Replace with actual leave amount */}
                    {employee.leaveAmount || "-"}
                  </td>
                  <td className="py-6 px-3 text-center">
                    {/* Replace with actual total */}
                    {employee.leaveTotal || "-"}
                  </td>
                  <td className="py-6 px-3 text-center">
                    <button
                      className="bg-primary-color text-white px-4 py-1 rounded-lg mr-2 hover:opacity-90 transition-opacity"
                      onClick={() =>
                        (window.location.href = `/employees/${employee.id}`)
                      }
                    >
                      Detail
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
