'use client';
import { NavigationBar } from "../../components/Navbar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAllEmployees } from "../../utils/fetchEmployee";

type Employee = {
  id: number;
  fullName: string;
  email: string;
  role: string;
};

export default function AdminPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getEmployees = async () => {
      try {
        setLoading(true);
        const data = await fetchAllEmployees(1);
        setEmployees(data.data || data || []);
      } catch (err) {
        setError("Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };
    getEmployees();
  }, []);

  const handleEditRedirect = (id: number) => {
    router.push(`/admin/edit/${id}`);
  };

  const handleCreate = () => {
    router.push("/admin/create-account");
  };

  return (
    <div className="relative">
      <div className="font-poppins scale-80 ">
        <NavigationBar accountName="Admin" />
        <div className="flex items-center justify-between mt-30">
          <div className="flex flex-col items-start">
            <h3 className="text-primary-color">
              Sense Sunset Seminyak Employee Management System
            </h3>
            <h1 className="font-bold text-4xl text-contrast-color">
              Welcome, Admin
            </h1>
          </div>
        </div>
        <div className="flex items-center justify-between mb-10 mt-10">
          <h2 className="text-2xl font-bold text-contrast-color">
            Employee Management
          </h2>
          <button
            className="bg-primary-color text-white px-8 py-3 rounded-xl font-semibold shadow hover:opacity-90 transition-opacity"
            onClick={handleCreate}
          >
            Create New Account
          </button>
        </div>
        <table className="w-full table-auto mt-20">
          <thead>
            <tr className="text-contrast-color">
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-red-500">
                  {error}
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6">
                  No employees found
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr
                  key={emp.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors text-center my-2"
                >
                  <td className="py-6 px-3 text-center">{emp.fullName}</td>
                  <td className="py-6 px-3 text-center">{emp.email}</td>
                  <td className="py-6 px-3 text-center">
                    <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-contrast-color">
                      {emp.role}
                    </span>
                  </td>
                  <td className="py-6 px-3 text-center">
                    <button
                      className="bg-primary-color text-white px-6 py-2 rounded-lg hover:bg-primary-color/90 transition"
                      onClick={() => handleEditRedirect(emp.id)}
                    >
                      Manage
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
