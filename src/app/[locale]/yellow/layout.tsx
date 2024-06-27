import Navbar from "@/components/Navbar/Navbar";
import { ReactNode } from "react";

export default function YellowPageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="mx-auto px-4 pt-4">{children}</main>
    </>
  );
}
