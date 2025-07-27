"use client";

import { useRouter } from "next/navigation";

interface ButtonProps {
  title: string;
  path?: string; // Optional path for navigation
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // Add optional onClick handler with event parameter
}

export const PrimaryButton = ({ title, path, onClick }: ButtonProps) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    }
    if (path) {
      router.push(path);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-primary-color font-medium text-white font-poppins px-14 py-2 rounded-xl hover:bg-secondary-color transition-colors duration-300 w-full"
    >
      {title}
    </button>
  );
};
