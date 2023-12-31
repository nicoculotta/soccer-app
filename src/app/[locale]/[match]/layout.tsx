import Navbar from "@/components/Navbar/Navbar";
import { MatchProvider } from "@/context/matchContext";
import { ReactNode } from "react";

export default function MatchPageLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { match: string };
}) {
  return (
    <>
      <Navbar />
      <MatchProvider params={params}>
        <main className="max-w-sm mx-auto px-4 pt-4">{children}</main>
      </MatchProvider>
    </>
  );
}
