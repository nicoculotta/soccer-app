"use client";
import { iUser } from "@/types/types";
import { Frown } from "lucide-react";
import React from "react";
import PlayerListItem from "./PlayerListItem";
import { useTranslations } from "next-intl";
import { useMatch } from "@/context/matchContext";
import { useAuth } from "@/context/authContext";
import { userInfo } from "os";

interface iPlayerList {
  title: string;
  list: iUser[];
  isAdmin: boolean;
}

const PlayerList = ({ title, list, isAdmin }: iPlayerList) => {
  const t = useTranslations();
  const { user } = useAuth();
  const { handleDeletePlayer, isLoading } = useMatch();

  if (isLoading) {
    return <>Skeleton</>;
  }
  return (
    <div>
      <h2>{title}</h2>
      <div className="flex flex-col gap-2 mt-3 mb-8">
        {list.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 px-6 h-48 rounded-md">
            <div className="rounded-full h-12 w-12 flex items-center justify-center bg-slate-200 dark:bg-slate-800 mb-3">
              <Frown size={24} />
            </div>
            <h3 className="text-muted-foreground">
              {t("matchPage.noPlayers")}
            </h3>
          </div>
        ) : (
          list.map((player, index) => (
            <PlayerListItem
              key={player.uid}
              avatar={player.avatar}
              name={player.name}
              number={index + 1}
              onDelete={() => handleDeletePlayer(player.uid)}
              role={player.role}
              deleteIcon={isAdmin || user.role === "super"}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PlayerList;
