"use client";
import React, { JSX } from "react";
import Image from "next/image";

import Logo from "../../../public/Logo.png";
import { PrimaryButton } from "../../../components/Button";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useState } from "react";
import { fetchSignup } from "../../../utils/fetchAuth";
import { useRouter } from "next/navigation";

export default function registerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    age: 0,
    department: "",
    position: "",
    role: "",
  });

  const handleSubmit = async () => {
    try {
      console.log("Form Data:", formData);
      const result = await fetchSignup(formData);
      router.push("/admin");
      if (result.success) {
      }
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value =
      e.target.name === "age" ? parseInt(e.target.value) || 0 : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  return (
    <div className="flex w-[53vw] flex-col justify-center mx-auto h-[100vh]">
      <button
        onClick={() => router.back()}
        className="px-10 py-2 text-primary-color border-2 border-primary-color rounded-full 
          hover:bg-primary-color hover:text-white transition-all duration-300 ease-in-out scale-75 w-[10rem] mx-20 mt-10"
      >
        ← Back
      </button>
      <div className="grid grid-cols-4 gap-10 h-screen w-[53vw] content-center relative mx-auto scale-80 -mt-20">
        <div className="col-span-2">
          <Image src={Logo} alt="Logo" className="w-[10rem]"></Image>
          <div className="text-primary-color -mb-1 mt-10">
            Please input employee credentials to create an account
          </div>
          <div className="text-4xl font-extrabold font-poppins mt-2 uppercase tracking-wide text-contrast-color leading-[3rem]">
            Employee <br></br> Management System
          </div>
        </div>
        <div className="row-start-2 col-span-2 place-self-end-safe w-full">
          <label htmlFor="fullName">Full Name</label>
          <div className="relative group">
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-14 py-2 mt-2 focus:outline-primary-color border-2 border-gray-300 rounded-2xl"
              placeholder="Enter your full name"
              required
            />
            <PersonOutlineOutlinedIcon className="absolute left-5 top-[57%] -translate-y-1/2 text-contrast-color group-focus-within:text-primary-color" />
          </div>
        </div>
        <div className="row-start-3 col-span-2">
          <label htmlFor="phoneNumber">Phone Number</label>
          <div className="relative group">
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full px-14 py-2 mt-2 focus:outline-primary-color border-2 border-gray-300 rounded-2xl"
              placeholder="Enter your phone number"
              required
            />
            <PersonOutlineOutlinedIcon className="absolute left-5 top-[57%] -translate-y-1/2 text-contrast-color group-focus-within:text-primary-color" />
          </div>
        </div>
        <div className="row-start-5 col-span-2">
          <label htmlFor="email">Email</label>
          <div className="relative group">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-14 py-2 mt-2 focus:outline-primary-color border-2 border-gray-300 rounded-2xl"
              placeholder="Enter your email"
              required
            />
            <PersonOutlineOutlinedIcon className="absolute left-5 top-[57%] -translate-y-1/2 text-contrast-color group-focus-within:text-primary-color" />
          </div>
        </div>
        <div className="row-start-4 col-span-2">
          <label htmlFor="department">Department</label>
          <div className="relative group">
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full px-14 py-2 mt-2 focus:outline-primary-color border-2 border-gray-300 rounded-2xl"
              required
            >
              <option value="" disabled>
                Select your department
              </option>
              <option value="IT">IT</option>
              <option value="HK">HK</option>
              <option value="SALES">SALES</option>
              <option value="FO">FO</option>
              <option value="F&B">F&amp;B</option>
              <option value="ENG">ENG</option>
              <option value="HR">HR</option>
              <option value="ACC">ACC</option>
            </select>
            <PersonOutlineOutlinedIcon className="absolute left-5 top-[57%] -translate-y-1/2 text-contrast-color group-focus-within:text-primary-color pointer-events-none" />
          </div>
        </div>
        <div className="col-start-3 col-span-2 row-start-3">
          <label htmlFor="position">Position</label>
          <div className="relative group">
            <select
              id="position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className="w-full px-14 py-2 mt-2 focus:outline-primary-color border-2 border-gray-300 rounded-2xl"
              required
            >
              <option value="" disabled>
                Select your position
              </option>
              <option value="PERMANENT EMPLOYEE">PERMANENT EMPLOYEE</option>
              <option value="CONTRACT EMPLOYEE">CONTRACT EMPLOYEE</option>
              <option value="DAILY WORKER">DAILY WORKER</option>
              <option value="INTERNSHIP/TRAINEE">INTERNSHIP/TRAINEE</option>
            </select>
            <PersonOutlineOutlinedIcon className="absolute left-5 top-[57%] -translate-y-1/2 text-contrast-color group-focus-within:text-primary-color pointer-events-none" />
          </div>
        </div>
        <div className="row-start-5 col-span-2">
          <label htmlFor="age">Age</label>
          <div className="relative group">
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full px-14 py-2 mt-2 focus:outline-primary-color border-2 border-gray-300 rounded-2xl"
              placeholder="Enter your age"
              required
            />
            <PersonOutlineOutlinedIcon className="absolute left-5 top-[57%] -translate-y-1/2 text-contrast-color group-focus-within:text-primary-color" />
          </div>
        </div>
        <div className="col-start-3 col-span-2 row-start-4">
          <label htmlFor="role">Role</label>
          <div className="relative group">
            <select
              id="role"
              name="role"
              value={formData.role || ""}
              onChange={handleInputChange}
              className="w-full px-14 py-2 mt-2 focus:outline-primary-color border-2 border-gray-300 rounded-2xl"
              required
            >
              <option value="" disabled>
                Select your role
              </option>
              <option value="HEAD">HEAD</option>
              <option value="HR">HR</option>
              <option value="ADMIN">ADMIN</option>
              <option value="HEAD">HEAD</option>
            </select>
            <PersonOutlineOutlinedIcon className="absolute left-5 top-[57%] -translate-y-1/2 text-contrast-color group-focus-within:text-primary-color pointer-events-none" />
          </div>
        </div>
        <div className="col-start-1 col-span-4 row-start-6">
          <label htmlFor="password">Password</label>
          <div className="relative group">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-14 py-2 mt-2 focus:outline-primary-color border-2 border-gray-300 rounded-2xl"
              placeholder="Enter your password"
              required
            />
            <LockOutlinedIcon className="absolute left-5 top-[57%] -translate-y-1/2 text-contrast-color group-focus-within:text-primary-color" />
          </div>
        </div>
        <div className="row-span-2 col-start-3 col-span-2 row-start-1 p-[10rem] rounded-4xl bg-primary-color"></div>
        <div className="mt-5 w-full col-start-2 col-span-2">
          <PrimaryButton title="Create Account" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
