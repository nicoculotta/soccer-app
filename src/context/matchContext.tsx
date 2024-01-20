"use client";

import { useToast } from "@/components/ui/use-toast";
import { iMatch, iUser } from "@/types/types";
import { createListOfPlayers, formatDayName } from "@/utils/formatters";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { db, updateMatchInfo } from "../lib/firebase";
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
  const locale = useLocale();

  const [matchInfo, setMatchInfo] = useState<iMatch | null>(null);
  const [isPlayerInList, setIsPlayerInList] = useState(false);
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const [isCopyLink, setIsCopyLink] = useState(false);
  const [backupPlayerIsDown, setBackupPlayerIsDown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleAddPlayer = (playerInfo: iUser) => {
    if (matchInfo) {
      const players = matchInfo.playerList;
      const lessTeamPlayers =
        matchInfo.teams.teamA.length < matchInfo.teams.teamB.length
          ? "teamA"
          : "teamB";
      updateMatchInfo(matchInfo.id, {
        playerList: [...players, playerInfo],
        teams: {
          [lessTeamPlayers]: [...matchInfo.teams[lessTeamPlayers], playerInfo],
        },
      });
      setMatchInfo({
        ...matchInfo,
        playerList: [...players, playerInfo],
      });
      setIsPlayerInList(true);
    }
  };

  const handleDeletePlayer = (playerId: string) => {
    if (matchInfo) {
      const playersFiltered = matchInfo.playerList.filter(
        (player) => player.uid !== playerId
      );
      const playerFilteredInA = matchInfo.teams?.teamA.filter(
        (player) => player.uid !== playerId
      );
      const playerFilteredInB = matchInfo.teams?.teamB.filter(
        (player) => player.uid !== playerId
      );
      const playerIndex = matchInfo.playerList.findIndex(
        (player) => player.uid === playerId
      );
      updateMatchInfo(matchInfo.id, {
        playerList: playersFiltered,
        teams: {
          teamA: playerFilteredInA,
          teamB: playerFilteredInB,
        },
      });
      setMatchInfo({
        ...matchInfo,
        playerList: playersFiltered,
        teams: {
          teamA: playerFilteredInA,
          teamB: playerFilteredInB,
        },
      });
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
    const playerListText = createListOfPlayers(matchInfo?.playerList);
    const enrolledPlayers = `(${matchInfo?.playerList.length}/16)`;

    const textToCopy = `\u26BD\u{1F5D2}\uFE0F ${t("matchPage.copyMatchLink", {
      day: matchInfo && formatDayName(matchInfo.day, locale),
      time: matchInfo?.time,
      link: window.location.origin + pathname,
    })}\n\n👤${t("matchPage.playerList", {
      number: enrolledPlayers,
    })}\n\n${playerListText}`;

    navigator.clipboard.writeText(textToCopy);
    setIsCopyLink(true);
    toast({
      title: t("matchPage.sharedButton"),
      description: t("matchPage.sharedLinkToastText"),
    });
    setTimeout(() => {
      setIsCopyLink(false);
    }, 2000);
  };

  const copyMessage = (message: string) => {
    navigator.clipboard.writeText(message);
    toast({
      title: t("matchPage.modal.copiedMessage"),
      description: t("matchPage.sharedLinkToastText"),
    });
  };

  const copyTeamsList = () => {
    const textTeamA = createListOfPlayers(matchInfo?.teams.teamA);
    const textTeamB = createListOfPlayers(matchInfo?.teams.teamB);

    const textToCopy = `\u{1F3F3}\uFE0F ${t(
      "createPage.titleWhite"
    )}\n\n${textTeamA}\n\n\u{1F3F4}${t(
      "createPage.titleBlack"
    )}\n\n${textTeamB}`;

    navigator.clipboard.writeText(textToCopy);
    setIsCopyLink(true);
    toast({
      title: t("matchPage.sharedButton"),
      description: t("matchPage.sharedLinkToastText"),
    });
    setTimeout(() => {
      setIsCopyLink(false);
    }, 2000);
  };

  useEffect(() => {
    const collectionRef = collection(db, "matches");
    const matchRef = doc(collectionRef, params.match as string);
    const unsubscribe = onSnapshot(matchRef, (snap) => {
      setMatchInfo(snap.data() as iMatch);
      setIsLoading(false);
    });
    return () => unsubscribe();
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
        isLoading,
        copyTeamsList,
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
