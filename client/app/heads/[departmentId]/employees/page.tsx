"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { NavigationBar } from "../../../../components/Navbar";
import { fetchEmployeesByDepartment } from "../../../../utils/fetchEmployee";
import { fetchUserRole } from "../../../../utils/fetchAuth";

// Define the User type based on your Prisma schema
interface User {
  id: number;
  fullName: string;
  position: string;
  phoneNumber: string;
  email: string;
  // Add other fields as needed
}

export default function DepartmentEmployeesPage() {
  const params = useParams();
  const departmentId = params?.departmentId as string;

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10; // Should match backend
  const [employees, setEmployees] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch employees from API
  useEffect(() => {
    if (!departmentId) return;
    fetchUserRole().then((data) => {
      if (data && data.role) {
        console.log("User role:", data.role);
           if (data.role !== "HEAD") {
             if (data.role === "HR" || data.role === "HUMANRESOURCES") {
               window.location.href = "/humanresources";
             } else {
               window.location.href = `/${data.role.toLowerCase()}`;
             }
           }
      } else {
        window.location.href = "/";
      }
    });
    setLoading(true);
    fetchEmployeesByDepartment(departmentId, page)
      .then((res) => {
        setEmployees(res.data || []);
        setTotal(res.total || 0);
      })
      .finally(() => setLoading(false));
  }, [departmentId, page]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  // Filter employees on client side by search
  const filteredEmployees = employees.filter(
    (emp) =>
      `${emp.fullName}`.toLowerCase().includes(search.toLowerCase()) ||
      emp.position.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <div className="font-poppins scale-80 ">
        <NavigationBar accountName="Head Department" />
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-between mt-30">
            <div className="flex flex-col items-start">
              <h3 className="text-primary-color">
                Sense Sunset Seminyak Employee Management System
              </h3>
              <h1 className="font-bold text-4xl text-contrast-color">
                Department Employees Data
              </h1>
            </div>
          </div>

          <button
            onClick={() => (window.location.href = `/heads/${departmentId}`)}
            className="mt-20 px-10 py-2 text-primary-color border-2 border-primary-color rounded-full 
        hover:bg-primary-color hover:text-white transition-all duration-300 ease-in-out"
          >
            ← Schedule
          </button>
        </div>
        <div className="px-4 py-6 md:px-8 mt-10">
          <div className="flex items-center justify-between mb-8">
            <span className="text-sm text-gray-500">
              Total Employees:{" "}
              <span className="font-bold text-contrast-color">{total}</span>
            </span>
            <input
              type="text"
              placeholder="Search"
              className="px-4 py-2 border-contrast-color rounded-full hover:border-primary-color transition-all duration-300 ease-in-out border-[1px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto">
            <div className="w-full">
              {/* Header */}
              <div className="grid grid-cols-7 bg-gray-50 text-contrast-color font-semibold rounded-t-xl border-contrast-color border-t border-x">
                <div className="px-4 py-3 border-b border-contrast-color">
                  NO
                </div>
                <div className="px-4 py-3 border-b border-contrast-color">
                  NAME
                </div>
                <div className="px-4 py-3 border-b border-contrast-color">
                  POSITION
                </div>
                <div className="px-4 py-3 border-b border-contrast-color">
                  PHONE
                </div>
                <div className="px-4 py-3 border-b border-contrast-color">
                  EMAIL
                </div>
                <div className="px-4 py-3 border-b border-contrast-color">
                  ADDRESS
                </div>
                <div className="px-4 py-3 border-b border-contrast-color text-center">
                  OPTIONS
                </div>
              </div>
              {/* Body */}
              {loading ? (
                <div className="grid grid-cols-7 border-x border-contrast-color">
                  <div className="col-span-7 text-center py-6 text-gray-400 border-b border-contrast-color">
                    Loading...
                  </div>
                </div>
              ) : filteredEmployees.length === 0 ? (
                <div className="grid grid-cols-7 border-x border-contrast-color">
                  <div className="col-span-7 text-center py-6 text-gray-400 border-b border-contrast-color">
                    No employees found
                  </div>
                </div>
              ) : (
                filteredEmployees.map((emp, idx) => (
                  <div
                    key={emp.id}
                    className="grid grid-cols-7 hover:bg-primary-color/10 transition-colors border-x border-b border-contrast-color"
                  >
                    <div className="px-4 py-3 font-semibold text-contrast-color flex items-center">
                      {(page - 1) * pageSize + idx + 1}
                    </div>
                    <div className="px-4 py-3 flex items-center">
                      {emp.fullName}
                    </div>
                    <div className="px-4 py-3 flex items-center">
                      {emp.position}
                    </div>
                    <div className="px-4 py-3 flex items-center">
                      {emp.phoneNumber}
                    </div>
                    <div className="px-4 py-3 flex items-center">
                      {emp.email}
                    </div>
                    <div className="px-4 py-3 flex items-center">-</div>
                    <div className="px-4 py-3 flex items-center justify-center">
                      <button
                        className="bg-secondary-color text-white px-4 py-2 rounded-full shadow hover:opacity-90 transition-all duration-300"
                        title="Details"
                        onClick={() =>
                          (window.location.href = `/employees/${emp.id}`)
                        }
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="flex justify-between items-center mt-8 gap-4">
            <span className="text-sm text-gray-500">
              Showing{" "}
              {filteredEmployees.length === 0 ? 0 : (page - 1) * pageSize + 1}{" "}
              to {Math.min(page * pageSize, total)} of {total} entries
            </span>
            <div>
              <button
                className="px-8 py-3 border-[1px] border-contrast-color text-contrast-color rounded-full font-semibold hover:bg-primary-color hover:text-white transition-all duration-300 ease-in-out mr-2"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                ←
              </button>
              <span className="px-2">{page}</span>
              <button
                className="px-8 py-3 border-[1px] border-contrast-color text-contrast-color rounded-full font-semibold hover:bg-primary-color hover:text-white transition-all duration-300 ease-in-out ml-2"
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage(page + 1)}
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
