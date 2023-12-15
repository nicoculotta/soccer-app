"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { MatchProvider } from "@/context/matchContext";
import MatchInfoButtons from "@/components/MatchInfoButtons/MatchInfoButtons";
import MatchPlayerList from "@/components/MatchPlayerList/MatchPlayerList";

export default function MatchPage({ params }: { params: { match: string } }) {
  const t = useTranslations();

  return (
    <MatchProvider params={params}>
      <div className="flex items-center justify-between mb-4">
        <Link href="/">
          <Button variant="outline" size={"sm"}>
            <ChevronLeft className="mr-2 h-4 w-4" />{" "}
            {t("userNavigation.backButton")}
          </Button>
        </Link>
      </div>
      <MatchInfoButtons />
      <MatchPlayerList />
    </MatchProvider>
  );
}
