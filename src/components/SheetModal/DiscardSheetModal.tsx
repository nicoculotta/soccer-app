"use client";
import React from "react";
import { Button } from "../ui/button";
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { SheetModal } from "./SheetModal";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useMatch } from "@/context/matchContext";

interface iDiscardSheetModal {
  isOpen: boolean;
  setIsOpen: ((open: boolean) => void) | undefined;
}

const DiscardSheetModal = ({ isOpen, setIsOpen }: iDiscardSheetModal) => {
  const t = useTranslations();
  const { matchInfo, backupPlayerIsDown, copyMessage } = useMatch();
  const pathname = usePathname();

  const messageToCopy = () => {
    if (typeof window !== "undefined") {
      if (matchInfo?.playerList[15]?.name && !backupPlayerIsDown) {
        return t("matchPage.modal.message", {
          reserva: matchInfo?.playerList[15]?.name,
          link: window.location.origin + pathname,
        });
      } else {
        return t("matchPage.modal.messageNoBackup", {
          link: window.location.origin + pathname,
        });
      }
    }
  };

  return (
    <SheetModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <SheetHeader>
        <SheetTitle className="text-xl">{`\u{1F62D} ${t(
          "matchPage.modal.title"
        )} \u{1F62D}`}</SheetTitle>
        <SheetDescription className="text-md">
          {t("matchPage.modal.text")}
        </SheetDescription>
      </SheetHeader>

      <SheetDescription className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md my-4">
        {messageToCopy()}
      </SheetDescription>

      <SheetFooter>
        <SheetClose asChild>
          <Button type="submit" onClick={() => copyMessage(messageToCopy())}>
            {t("matchPage.modal.copyMessageButton")}
          </Button>
        </SheetClose>
      </SheetFooter>
    </SheetModal>
  );
};

export default DiscardSheetModal;
