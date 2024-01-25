"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import { ModeToggle } from "../ModeToggle/ModeToggle";
import UserMenu from "./UserMenu";

function NavbarContent() {
  const { theme } = useTheme();
  return (
    <>
      <div className="flex gap-2">
        <Image
          src={theme === "light" ? "/furbo.svg" : "/furbo-dark.svg"}
          alt="Furbo Logo"
          width={110}
          height={40}
        />
      </div>
      <div className="grid gap-4 grid-cols-2">
        <ModeToggle />
        <UserMenu />
      </div>
    </>
  );
}

export default function Navbar() {
  return (
    <div className="border-b">
      <div className="flex h-16 justify-between items-center px-4">
        <NavbarContent />
      </div>
    </div>
  );
}
