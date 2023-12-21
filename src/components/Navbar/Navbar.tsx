import { Trophy } from "lucide-react";
import { ModeToggle } from "../ModeToggle/ModeToggle";
import UserMenu from "./UserMenu";

function NavbarContent() {
  return (
    <>
      <div className="flex gap-2">
        <Trophy />
        <span className="font-medium text-lg">Furbo</span>
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
