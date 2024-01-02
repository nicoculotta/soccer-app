"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import MatchInfoButtons from "@/components/MatchInfoButtons/MatchInfoButtons";
import MatchPlayerList from "@/components/MatchPlayerList/MatchPlayerList";
import { useAuth } from "@/context/authContext";
import { MatchSkeleton } from "@/components/Skeletons/MatchSkeleton";

export default function MatchPage({ params }: { params: { match: string } }) {
  const t = useTranslations();
  const { user, loading } = useAuth();

  if (loading) return <MatchSkeleton />;

  if (!user) {
    return null;
  }

  return (
    <>
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
    </>
  );
}
