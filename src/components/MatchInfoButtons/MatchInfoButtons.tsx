import { useAuth } from "@/context/authContext";
import { useMatch } from "@/context/matchContext";
import { cn } from "@/lib/utils";
import { formatDayName } from "@/utils/formatters";
import { Check, UsersRound } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";

const MatchInfoButtons = () => {
  const t = useTranslations();
  const locale = useLocale();
  const { user } = useAuth();
  const pathname = usePathname();
  const {
    matchInfo,
    isPlayerInList,
    isCopyLink,
    handleDeletePlayer,
    handleAddPlayer,
    copyLink,
  } = useMatch();

  return (
    <div>
      {matchInfo && (
        <div className="grid grid-cols-1 gap-y-2 mb-8">
          <div className="grid grid-cols-1 gap-y-2 mb-4">
            <span className="text-sm text-muted-foreground">
              {matchInfo.date}
            </span>
            <h3 className="text-2xl font-semibold leading-none tracking-tight">{`${formatDayName(
              matchInfo.day,
              locale
            )} ${matchInfo.time} hs`}</h3>
          </div>
          <div className="flex w-full gap-2">
            <Button
              className={cn(
                isPlayerInList &&
                  "bg-green-600 focus:bg-green-600 hover:bg-green-500 dark:bg-green-400 dark:focus:bg-green-400 dark:hover:bg-green-500",
                "flex-1"
              )}
              onClick={() =>
                isPlayerInList
                  ? handleDeletePlayer(user.uid)
                  : handleAddPlayer(user)
              }
            >
              {isPlayerInList
                ? t("matchPage.enrolledMatch")
                : t("matchPage.enrollMatch")}
              {isPlayerInList && <Check size={20} className="ml-2" />}
            </Button>
            <Button
              className="flex-1"
              variant={"outline"}
              onClick={copyLink}
              disabled={isCopyLink}
            >
              {isCopyLink
                ? t("matchPage.sharedButton")
                : t("matchPage.shareButton")}
              {isCopyLink && <Check size={20} className="ml-2" />}
            </Button>
          </div>
          {(user.role === "admin" || user.role === "super") &&
            matchInfo.owner.name === user.name && (
              <Button className="flex-1" variant={"secondary"} asChild>
                <Link href={`${pathname}/create`}>
                  <UsersRound size={20} className="mr-2" />
                  {t("matchPage.createTeam")}
                </Link>
              </Button>
            )}
        </div>
      )}
    </div>
  );
};

export default MatchInfoButtons;
