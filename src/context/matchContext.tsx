"use client";

import { useToast } from "@/components/ui/use-toast";
import { iMatch, iUser } from "@/types/types";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { getMatchById, updateMatchInfo } from "../lib/firebase";
import { useAuth } from "./authContext";

const MatchContext = createContext<any>(null);

export const MatchProvider = ({
  children,
  params,
}: {
  children: ReactNode;
  params: { match: string };
}) => {
  const t = useTranslations();
  const { user } = useAuth();
  const pathname = usePathname();
  const { toast } = useToast();

  const [matchInfo, setMatchInfo] = useState<iMatch | null>(null);
  const [isPlayerInList, setIsPlayerInList] = useState(false);
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const [isCopyLink, setIsCopyLink] = useState(false);
  const [backupPlayerIsDown, setBackupPlayerIsDown] = useState(false);

  const getMatch = async () => {
    const res = await getMatchById(params.match as string);
    setMatchInfo(res);
  };

  const handleAddPlayer = (playerInfo: iUser) => {
    if (matchInfo) {
      const players = matchInfo.playerList;
      updateMatchInfo(matchInfo.id, {
        playerList: [...players, playerInfo],
      });
      setMatchInfo({ ...matchInfo, playerList: [...players, playerInfo] });
      setIsPlayerInList(true);
    }
  };

  const handleDeletePlayer = (playerId: string) => {
    if (matchInfo) {
      const playersFiltered = matchInfo.playerList.filter(
        (player) => player.uid !== playerId
      );
      const playerIndex = matchInfo.playerList.findIndex(
        (player) => player.uid === playerId
      );
      updateMatchInfo(matchInfo.id, {
        playerList: playersFiltered,
      });
      setMatchInfo({ ...matchInfo, playerList: playersFiltered });
      setIsPlayerInList(false);

      if (user.uid === playerId) {
        setIsDiscardOpen(!isDiscardOpen);
      }
      if (playerIndex > 15) {
        setBackupPlayerIsDown(true);
      } else {
        setBackupPlayerIsDown(false);
      }
    }
  };

  const copyLink = () => {
    const textToCopy = t("matchPage.copyMatchLink", {
      day: matchInfo?.date,
      time: matchInfo?.time,
      link: window.location.origin + pathname,
    });

    navigator.clipboard.writeText(textToCopy);
    setIsCopyLink(true);
    toast({
      title: t("matchPage.sharedButton"),
      description: t("matchPage.sharedLinkToastText"),
    });
    setTimeout(() => {
      setIsCopyLink(false);
    }, 3000);
  };

  const copyMessage = (message: string) => {
    navigator.clipboard.writeText(message);
    toast({
      title: t("matchPage.modal.copiedMessage"),
      description: t("matchPage.sharedLinkToastText"),
    });
  };

  useEffect(() => {
    getMatch();
  }, []);

  useEffect(() => {
    if (user && matchInfo) {
      const playerInList = matchInfo.playerList.some(
        (player) => player.uid === user.uid
      );
      setIsPlayerInList(playerInList);
    }
  }, [matchInfo, user]);

  return (
    <MatchContext.Provider
      value={{
        matchInfo,
        setMatchInfo,
        handleAddPlayer,
        handleDeletePlayer,
        copyLink,
        isPlayerInList,
        isDiscardOpen,
        setIsDiscardOpen,
        isCopyLink,
        backupPlayerIsDown,
        copyMessage,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};

export const useMatch = () => {
  const match = useContext(MatchContext);
  if (match === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return match;
};
