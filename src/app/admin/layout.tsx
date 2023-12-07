import Navbar from "@/components/Navbar/Navbar";
import UserMenu from "@/components/Navbar/UserMenu";
import { Trophy } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export default function AdminPageLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar>
        <Link href="/">
          <div className="flex gap-2">
            <Trophy />
            <span className="font-medium">Fútbol El Palo</span>
          </div>
        </Link>
        <UserMenu />
      </Navbar>
      <main className="max-w-sm mx-auto px-4 pt-4">{children}</main>
    </>
  );
}
