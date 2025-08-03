"use client";
import { useEffect, useState } from "react";
import * as React from "react";
import { NavigationBar } from "../../../../components/Navbar";
import { useRouter } from "next/navigation";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { fetchCompleteProfile } from "../../../../utils/fetchProfile";
import { updateEmployeeProfile } from "../../../../utils/fetchEmployee";
import { fetchUserRole } from "../../../../utils/fetchAuth"; // <-- Import here

export default function EditEmployeePage({
  params,
}: {
  params: { employeeId: string };
}) {
  const { employeeId } = params;
  const router = useRouter();

  const [profileData, setProfileData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    age: 0,
    department: "",
    position: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserRole().then((data) => {
      if (data && data.role) {
        console.log("User role:", data.role);
        if (data.role !== "ADMIN") {
          window.location.href = "/";
        }
      } else {
        window.location.href = "/";
      }
    });
    const fetchProfile = async () => {
      try {
        const profile = await fetchCompleteProfile(Number(employeeId));
        const user = profile.user;
        setProfileData({
          fullName: user.fullName || "",
          phoneNumber: user.phoneNumber || "",
          email: user.email || "",
          password: user.password || "",
          age: user.age || 0,
          department: user.department.name || "",
          position: user.position || "",
          role: user.role || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [employeeId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: name === "age" ? Number(value) : value,
    }));
  };

  // Save handler using updateEmployeeProfile
  const handleSave = async () => {
    setLoading(true);
    try {
      await updateEmployeeProfile(Number(employeeId), profileData);
      alert("Profile updated successfully!");

      router.back();
    } catch (error) {
      alert("Failed to update profile.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-poppins relative -mt-20">
      <div className="scale-80 ">
        <NavigationBar accountName="Admin" />
        <button
          onClick={() => router.back()}
          className="mt-20 px-10 py-2 text-primary-color border-2 border-primary-color rounded-full 
            hover:bg-primary-color hover:text-white transition-all duration-300 ease-in-out"
        >
          ← Back
        </button>
        <div className="flex flex-col items-start mt-10">
          <h3 className="text-primary-color">
            Sense Sunset Seminyak Employee Management System
          </h3>
          <h1 className="font-bold text-4xl text-contrast-color">
            Edit Employee Profile
          </h1>
        </div>
        <form
          className="flex flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="grid grid-cols-4 gap-10 mt-24 ml-45 content-center w-[95rem] scale-120 ">
            <div className="col-start-1 col-span-2 row-span-3 p-[10rem] rounded-4xl bg-primary-color"></div>
            <div className="col-start-3 col-span-2">
              <label htmlFor="fullName">Full Name</label>
              <div className="relative group">
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleChange}
                  className="w-full px-14 py-2 mt-2 border-1 border-gray-300 rounded-2xl bg-white"
                  required
                />
                <PersonOutlineOutlinedIcon className="absolute left-5 top-[57%] -translate-y-1/2 text-contrast-color" />
              </div>
            </div>
            <div className="col-start-3 row-start-2 col-span-2">
              <label htmlFor="phoneNumber">Phone Number</label>
              <div className="relative group">
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={profileData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-14 py-2 mt-2 border-1 border-gray-300 rounded-2xl bg-white"
                />
                <PersonOutlineOutlinedIcon className="absolute left-5 top-[57%] -translate-y-1/2 text-contrast-color" />
              </div>
            </div>
            <div className="col-start-3 row-start-3 col-span-2">
              <label htmlFor="age">Age</label>
              <div className="relative group">
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={profileData.age}
                  onChange={handleChange}
                  className="w-full px-14 py-2 mt-2 border-1 border-gray-300 rounded-2xl bg-white"
                  min={0}
                />
                <PersonOutlineOutlinedIcon className="absolute left-5 top-[57%] -translate-y-1/2 text-contrast-color" />
              </div>
            </div>
            <div className="col-start-3 row-start-4 col-span-2">
              <label htmlFor="email">Email</label>
              <div className="relative group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  className="w-full px-14 py-2 mt-2 border-1 border-gray-300 rounded-2xl bg-white"
                  required
                />
                <PersonOutlineOutlinedIcon className="absolute left-5 top-[57%] -translate-y-1/2 text-contrast-color" />
              </div>
            </div>
            <div className="col-start-3 row-start-5 col-span-2">
              <label htmlFor="position">Position</label>
              <div className="relative group">
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={profileData.position}
                  onChange={handleChange}
                  className="w-full px-14 py-2 mt-2 border-1 border-gray-300 rounded-2xl bg-white"
                />
                <PersonOutlineOutlinedIcon className="absolute left-5 top-[57%] -translate-y-1/2 text-contrast-color" />
              </div>
            </div>
            <div className="col-start-1 row-start-4 col-span-2">
              <label htmlFor="department">Department</label>
              <div className="relative group">
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={profileData.department}
                  onChange={handleChange}
                  className="w-full px-14 py-2 mt-2 border-1 border-gray-300 rounded-2xl bg-white"
                />
                <PersonOutlineOutlinedIcon className="absolute left-5 top-[57%] -translate-y-1/2 text-contrast-color" />
              </div>
            </div>
            <div className="col-start-1 row-start-5 col-span-2">
              <label htmlFor="role">Role</label>
              <div className="relative group">
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={profileData.role}
                  onChange={handleChange}
                  className="w-full px-14 py-2 mt-2 border-1 border-gray-300 rounded-2xl bg-white"
                />
                <PersonOutlineOutlinedIcon className="absolute left-5 top-[57%] -translate-y-1/2 text-contrast-color" />
              </div>
            </div>
          </div>
          <div className="flex mt-30">
            <button
              type="submit"
              className="px-10 py-3 ml-5 bg-primary-color text-white rounded-xl hover:opacity-80 transition-all duration-300 ease-in-out shadow-md"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
