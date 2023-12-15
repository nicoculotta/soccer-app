import { useAuth } from "@/context/authContext";
import { useMatch } from "@/context/matchContext";
import { cn } from "@/lib/utils";
import { formatDayName } from "@/utils/formatters";
import { Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React from "react";
import { Button } from "../ui/button";

const MatchInfoButtons = () => {
  const t = useTranslations();
  const locale = useLocale();
  const { user } = useAuth();
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
        </div>
      )}
    </div>
  );
};

export default MatchInfoButtons;
