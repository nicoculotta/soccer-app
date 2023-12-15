import Navbar from "@/components/Navbar/Navbar";
import { ReactNode } from "react";

export default function AdminPageLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="max-w-sm mx-auto px-4 pt-4">{children}</main>
    </>
  );
}
