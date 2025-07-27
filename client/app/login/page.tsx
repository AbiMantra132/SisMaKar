"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "../../public/Logo.png";
import { PrimaryButton } from "../../components/Button";
import { fetchLogin } from "../../utils/fetchAuth";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetchLogin(formData);
      console.log("Login response:", response);
      if (response.success) {
        const user = response.user;
        if (user.role === "HEAD") {
          router.push(`/heads/${user.departmentName}`);
        } else if (user.role === "HR") {
          router.push("/humanresources/dashboard");
        } else {
          router.push("/employees/" + user.id); // Default redirect
        }
      } else {
        setError(response.message || "Login failed");
      }
    } catch (error) {
      setError("An error occurred during login");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen mx-10 font-poppins scale-90">
      <div className="flex items-center mx-auto justify-around gap-20 w-[80%]">
        <div className="w-[70rem] flex justify-end h-[55rem] bg-orange-400 rounded-[5rem]"></div>
        <div className="flex flex-col w-full">
          <div className="flex flex-col w-[40rem] bg-white rounded-[5rem] p-10">
            <Image src={Logo} alt="Logo" className="w-[10rem]" />
            <div className="text-primary-color -mb-1 mt-10">
              Please input your credentials to log in
            </div>
            <div className="text-4xl font-extrabold font-poppins mt-2 uppercase tracking-wide text-contrast-color leading-[3rem]">
              Employee <br /> Management System
            </div>
            {error && <div className="text-red-500 mt-4">{error}</div>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-10">
              <label htmlFor="email">Email</label>
              <div className="relative group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-14 py-2 -mt-2 focus:outline-primary-color border-2 border-gray-300 rounded-2xl"
                  placeholder="Enter your email"
                  required
                />
                <PersonOutlineOutlinedIcon className="absolute left-5 top-3.5 -translate-y-1/2 text-contrast-color group-focus-within:text-primary-color" />
              </div>
              <label htmlFor="password" className="mt-5">
                Password
              </label>
              <div className="relative group">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-14 py-2 -mt-2 focus:outline-primary-color border-2 border-gray-300 rounded-2xl"
                  placeholder="Enter your password"
                  required
                />
                <LockOutlinedIcon className="absolute left-5 top-3.5 -translate-y-1/2 text-contrast-color group-focus-within:text-primary-color" />
              </div>
              <div className="mt-5 w-full">
                <PrimaryButton title="Sign In" onClick={handleSubmit} />
              </div>
            </form>
            <div className="mt-40 text-center">
              <span className="text-contrast-color">
                Don't have an account?
              </span>{" "}
              <Link href="/signup" className="text-primary-color cursor-pointer">
                Register here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
