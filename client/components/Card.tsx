"use client";

import React, { JSX } from "react";
import { useRouter } from "next/navigation";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

interface CardProps {
  name: string;
  description: string;
  position: string;
  url?: string; // Optional URL for the profile image
  id: number; // Optional id for the card, if needed
}

export const Card = ({ name, description, position, id, url }: CardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/humanresources/recruitment/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="border p-10 font-poppins border-contrast-color cursor-pointer hover:shadow-lg transition-shadow duration-300 rounded-3xl hover:border-primary-color min-h-[15rem] flex"
    >
      <div className="self-center w-full px-5 group">
        <div className="flex items-center mb-4 justify-between w-full">
          <div className="flex items-center">
            <img
              src={url}
              alt={`${name}'s profile`}
              className="w-10 h-10 rounded-full object-cover mr-4 self-center"
            />
            <div>
              <h2 className="text-xl">{name}</h2>
              <p className="text-primary-color mb-2">{position}</p>
            </div>
          </div>
          <ArrowRightAltIcon className="text-primary-color scale-[200%] group-hover:scale-[220%] transition-all" />
        </div>
        <p className="text-gray-600 mb-1 ml-14">
          {description.length > 70 ? description.substring(0,300) + '...' : description}
        </p>
      </div>
    </div>
  );
};
