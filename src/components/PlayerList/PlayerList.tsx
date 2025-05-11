"use client";
import { iUser } from "@/types/types";
import { Frown } from "lucide-react";
import React, { useState } from "react";
import PlayerListItem from "./PlayerListItem";
import { useTranslations } from "next-intl";
import { useMatch } from "@/context/matchContext";
import { useAuth } from "@/context/authContext";
import { MatchSkeleton } from "../Skeletons/MatchSkeleton";
import { SheetModal } from "../SheetModal/SheetModal";
import { Button } from "../ui/button";

interface iPlayerList {
  title: string;
  list: iUser[];
  isAdmin: boolean;
}

const PlayerList = ({ title, list, isAdmin }: iPlayerList) => {
  const t = useTranslations();
  const { user } = useAuth();
  const { handleDeletePlayer, isLoading } = useMatch();
  const [playerToDelete, setPlayerToDelete] = useState<iUser | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (isLoading) {
    return <MatchSkeleton />;
  }

  const onDeleteRequest = (player: iUser) => {
    setPlayerToDelete(player);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (playerToDelete) {
      handleDeletePlayer(playerToDelete.uid);
      setIsDeleteModalOpen(false);
      setPlayerToDelete(null);
    }
  };

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
              onDelete={() => onDeleteRequest(player)}
              role={player.role}
              deleteIcon={isAdmin || user.role === "super"}
              yellowCard={player.yellow}
            />
          ))
        )}
      </div>

      <SheetModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        isAdmin={true}
      >
        <div className="flex flex-col gap-4 items-center justify-center p-4">
          <h2 className="text-xl font-semibold">
            {t("matchPage.deletePlayerConfirmation.title")}
          </h2>
          <p>
            {t("matchPage.deletePlayerConfirmation.message", {
              name: playerToDelete?.name || "",
            })}
          </p>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {t("common.confirm")}
            </Button>
          </div>
        </div>
      </SheetModal>
    </div>
  );
};

export default PlayerList;
