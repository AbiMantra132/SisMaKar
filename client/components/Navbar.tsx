"use client";

import Image from "next/image";
import Logo from "../public/Logo.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

interface Navbar {
  accountName: string;
}

export const NavigationBar = ({ accountName }: Navbar) => {

  return (
    <div className="flex justify-between items-center text-contrast-color">
      <Image src={Logo} alt="Logo" className="w-[10rem]" />
      <div className="flex items-center gap-4">
        <AccountCircleIcon className="scale-150" />
        <h1 className="font-poppins tracking-wider">{accountName}</h1>
      </div>
    </div>
  );
};
