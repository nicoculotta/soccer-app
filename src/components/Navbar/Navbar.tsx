import { ReactNode } from "react";

export default function Navbar({ children }: { children: ReactNode }) {
  return (
    <div className="border-b">
      <div className="flex h-16 justify-between items-center px-4">
        {children}
      </div>
    </div>
  );
}
