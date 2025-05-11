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
      // Primero obtener el índice del jugador antes de filtrarlo
      const playerIndex = matchInfo.playerList.findIndex(
        (player) => player.uid === playerId
      );
      
      // Obtener información sobre el jugador que se elimina
      const isPlayerInStartingLineup = playerIndex < 16;
      const hasReserves = matchInfo.playerList.length > 16;
      
      // Filtrar las listas después de obtener la información necesaria
      const playersFiltered = matchInfo.playerList.filter(
        (player) => player.uid !== playerId
      );
      const playerFilteredInA = matchInfo.teams?.teamA.filter(
        (player) => player.uid !== playerId
      );
      const playerFilteredInB = matchInfo.teams?.teamB.filter(
        (player) => player.uid !== playerId
      );
      
      // Identificar el primer jugador de reserva que subirá a titular
      let reservePlayerMovingUp = null;
      if (isPlayerInStartingLineup && hasReserves) {
        // El jugador en el índice 16 es el primer reserva
        reservePlayerMovingUp = matchInfo.playerList[16];
      }
      
      // Calcular espacios vacantes después de eliminar al jugador
      // Si quedan menos de 16 jugadores, tendremos espacios disponibles
      const spacesLeft = Math.max(0, 16 - playersFiltered.length);
      
      // Objeto con la información de la acción para guardar en Firebase
      const lastPlayerAction = {
        type: 'playerRemoved',
        playerIndex: playerIndex,
        reservePlayerMovingUp: reservePlayerMovingUp,
        spacesLeft: spacesLeft,
        timestamp: new Date().getTime()
      };
    
      
      // Actualizar en Firebase
      updateMatchInfo(matchInfo.id, {
        playerList: playersFiltered,
        teams: {
          teamA: playerFilteredInA,
          teamB: playerFilteredInB,
        },
        lastPlayerAction: lastPlayerAction
      });
      
      // Actualizar estado local
      setMatchInfo({
        ...matchInfo,
        playerList: playersFiltered,
        teams: {
          teamA: playerFilteredInA,
          teamB: playerFilteredInB,
        },
        lastPlayerAction: lastPlayerAction
      });
      
      setIsPlayerInList(false);

      if (user.uid === playerId) {
        setIsDiscardOpen(!isDiscardOpen);
      }
      
      // Decidir si es jugador de reserva o titular para notificaciones
      if (playerIndex >= 16) {
        setBackupPlayerIsDown(true);
      } else {
        setBackupPlayerIsDown(false);
      }
    }
  };

  const copyLink = () => {
    if (!matchInfo) return;
    
    const playerListText = createListOfPlayers(matchInfo.playerList);
    const enrolledPlayers = `(${matchInfo.playerList.length}/16)`;
    
    let statusMessage = "";
    
    // Determinar si hay menos de 16 jugadores en total
    const totalPlayersCount = matchInfo.playerList.length;
    const spacesLeft = 16 - totalPlayersCount;
    
    // Agregar mensaje según la última acción o el estado actual
    if (matchInfo.lastPlayerAction && matchInfo.lastPlayerAction.type === 'playerRemoved') {
      const action = matchInfo.lastPlayerAction;
      
      // Caso 1: Jugador titular se dio de baja y no hay reservas
      if (action.playerIndex < 16 && totalPlayersCount < 16) {
        statusMessage = `\n\n🔄 ${t("matchPage.statusMessages.missingPlayers", {
          count: spacesLeft,
          plural: spacesLeft !== 1 ? 's' : ''
        })}\n`;
      } 
      // Caso 2: Jugador titular se dio de baja y hay reservas que subieron a titular
      else if (action.playerIndex < 16 && action.reservePlayerMovingUp) {
        statusMessage = `\n\n🔄 ${t("matchPage.statusMessages.newStarterPlayer", {
          name: action.reservePlayerMovingUp.name
        })}\n`;
      }
      // Caso 3: Jugador de reserva se dio de baja - sin mensaje especial
    }
    // Si no hay acción de jugador pero hay menos de 16 jugadores, mostrar mensaje de espacios disponibles
    else if (totalPlayersCount < 16) {
      statusMessage = `\n\n🔄 ${t("matchPage.statusMessages.missingPlayers", {
        count: spacesLeft,
        plural: spacesLeft !== 1 ? 's' : ''
      })}\n`;
    }

    const textToCopy = `\u26BD\u{1F5D2}\uFE0F ${t("matchPage.copyMatchLink", {
      day: matchInfo && formatDayName(matchInfo.day, locale),
      time: matchInfo?.time,
      link: window.location.origin + pathname,
    })}\n\n👤${t("matchPage.playerList", {
      number: enrolledPlayers,
    })}${statusMessage}\n\n${playerListText}`;

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


  // Copiar lista de equipos negro o blanco
  const copyTeamsList = () => {
    if (!matchInfo || !matchInfo.teams) {
      toast({
        title: t("createPage.alerts.fewPlayers.title"),
        description: "No hay equipos definidos todavía.",
      });
      return;
    }
    
    // Garantizar que los equipos son arrays válidos
    const teamA = Array.isArray(matchInfo.teams.teamA) ? matchInfo.teams.teamA : [];
    const teamB = Array.isArray(matchInfo.teams.teamB) ? matchInfo.teams.teamB : [];
    
    // Crear texto para cada equipo
    const textTeamA = createListOfPlayers(teamA);
    const textTeamB = createListOfPlayers(teamB);

    const textToCopy = `\u{1F3F3}\uFE0F ${t(
      "createPage.titleWhite"
    )} (${teamA.length})\n\n${textTeamA}\n\n\u{1F3F4}${t(
      "createPage.titleBlack"
    )} (${teamB.length})\n\n${textTeamB}`;

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
