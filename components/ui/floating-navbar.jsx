"use client";

import { cn } from "@/utils/cn";
import Link from "next/link";
import Logo from "../Logo";

export const FloatingNav = ({ navItems, className }) => {
  return (
    <div
      className={cn(
        "flex max-w-fit fixed top-5 gap-4 inset-x-0 mx-auto border-[1px] border-neutral-700 rounded-full bg-black shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] px-5 py-4  items-center justify-center space-x-4",
        className
      )}
    >
      <Logo className="relative flex space-x-1 items-center" />

      {navItems.map((navItem, idx) => (
        <Link
          key={`link=${idx}`}
          href={navItem.link}
          className={cn(
            "relative text-neutral-50 items-center flex space-x-1 hover:text-neutral-300"
          )}
        >
          <span className="block sm:hidden">{navItem.icon}</span>
          <span className="hidden sm:block text-sm">{navItem.name}</span>
        </Link>
      ))}
    </div>
  );
};
