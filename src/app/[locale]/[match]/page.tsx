"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import MatchInfoButtons from "@/components/MatchInfoButtons/MatchInfoButtons";
import MatchPlayerList from "@/components/MatchPlayerList/MatchPlayerList";
import { useAuth } from "@/context/authContext";
import { MatchSkeleton } from "@/components/Skeletons/MatchSkeleton";
import CustomSheetModal from "@/components/SheetModal/CustomSheetModal";
import { useEffect, useState } from "react";
import {
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SheetModal } from "@/components/SheetModal/SheetModal";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function MatchPage({ params }: { params: { match: string } }) {
  const t = useTranslations();
  const { user, loading } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setModalOpen(user.yellow);
    }
  }, [user]);

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
      <SheetModal isOpen={modalOpen} setIsOpen={() => setModalOpen(!modalOpen)}>
        <SheetHeader className="flex justify-center items-center">
          <Avatar className="h-20 w-20  bg-slate-100 mt-4 border-2 border-slate-300">
            <AvatarImage className="object-contain" src={"/amonestado.png"} />
          </Avatar>

          <SheetTitle className="text-xl mt-10">{`${t(
            "matchPage.yellowTitle"
          )}`}</SheetTitle>
          <SheetDescription className="text-md">
            {t("matchPage.yellowDescription")}
          </SheetDescription>
          <div className="h-10"></div>
        </SheetHeader>
      </SheetModal>
    </>
  );
}
