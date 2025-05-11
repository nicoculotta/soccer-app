"use client";
import { useMatch } from "@/context/matchContext";
import React, { useEffect, useState } from "react";
import { iMatch, iUser } from "@/types/types";
import { useTranslations } from "next-intl";
import { Check, ChevronLeft, Copy, Shirt, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateMatchInfo } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CreateTeamPage = ({ params }: { params: { match: string } }) => {
  const router = useRouter();
  const t = useTranslations();
  const { matchInfo, setMatchInfo, copyTeamsList, isCopyLink } = useMatch();
  const [teamsInitialized, setTeamsInitialized] = useState(false);

  // Función para verificar si un jugador está en el top 16
  const isPlayerInTop16 = (uid: string) => {
    if (!matchInfo?.playerList) return false;
    
    // Encontrar el índice del jugador en la lista completa
    const playerIndex = matchInfo.playerList.findIndex(
      (player: iUser) => player.uid === uid
    );
    
    // Retorna true si el jugador está entre los primeros 16
    return playerIndex >= 0 && playerIndex < 16;
  };

  function findContainer(id: string): string | undefined {
    if (!matchInfo?.teams) return undefined;
    return Object.keys(matchInfo.teams).find((key) =>
      matchInfo.teams[key].some((player: iUser) => player.uid === id)
    );
  }

  function savePlayerList(matchId: string, data: any) {
    updateMatchInfo(matchId, data);
  }

  function handleChangeTeam(id: string) {
    if (!matchInfo?.teams) return;
    
    // Solo permitir mover jugadores que están en el top 16
    if (!isPlayerInTop16(id)) {
      return;
    }

    const activeTeam = findContainer(id) as string;
    const otherTeam = activeTeam === "teamA" ? "teamB" : "teamA";
    const activePlayer = matchInfo.teams[activeTeam].find(
      (player: iUser) => player.uid === id
    );
    const restOfPlayers = matchInfo.teams[activeTeam].filter(
      (player: iUser) => player.uid !== id
    );

    if (activePlayer) {
      setMatchInfo((prev: iMatch) => ({
        ...prev,
        teams: {
          [activeTeam]: restOfPlayers,
          [otherTeam]: [...prev.teams[otherTeam], activePlayer],
        },
      }));
      savePlayerList(params.match, {
        teams: {
          [activeTeam]: restOfPlayers,
          [otherTeam]: [...matchInfo.teams[otherTeam], activePlayer],
        },
      });
    }
  }

  // Inicializar equipos de manera balanceada
  useEffect(() => {
    // Solo proceder si tenemos datos del partido
    if (!matchInfo) return;

    // Verificar si ya tenemos los equipos correctamente configurados
    const hasValidTeams = matchInfo.teams && 
                         Array.isArray(matchInfo.teams.teamA) && 
                         Array.isArray(matchInfo.teams.teamB);
    
    const hasPlayers = Array.isArray(matchInfo.playerList) && matchInfo.playerList.length > 0;
  
    
    // Si ya inicializamos los equipos o ya están configurados correctamente, no hacer nada
    if (teamsInitialized || (hasValidTeams && (matchInfo.teams.teamA.length > 0 || matchInfo.teams.teamB.length > 0))) {
      return;
    }
    
    // Si tenemos jugadores pero no equipos, inicializar los equipos
    if (hasPlayers) {

      const availablePlayers = matchInfo.playerList.slice(0, 16);
      const totalPlayers = availablePlayers.length;
      
      const midPoint = Math.ceil(totalPlayers / 2);
      
      const teamA = availablePlayers.slice(0, midPoint);
      const teamB = availablePlayers.slice(midPoint, totalPlayers);
      
      
      // Actualizar en Firebase y marcar como inicializado
      savePlayerList(params.match, {
        teams: {
          teamA,
          teamB
        }
      });
      
      setTeamsInitialized(true);
    }
  }, [matchInfo, params.match, teamsInitialized]);

  // Si no hay información de partidos, mostrar carga
  if (!matchInfo) {
    return <div className="p-4 text-center">{t("createPage.loading")}</div>;
  }

  // Garantizar que teams existe y tiene las propiedades teamA y teamB como arrays
  const teams = matchInfo.teams || { teamA: [], teamB: [] };
  
  // Filtrar equipos para solo incluir jugadores que están en los primeros 16
  const teamA = Array.isArray(teams.teamA) 
    ? teams.teamA.filter((player: iUser) => isPlayerInTop16(player.uid)) 
    : [];
  
  const teamB = Array.isArray(teams.teamB) 
    ? teams.teamB.filter((player: iUser) => isPlayerInTop16(player.uid)) 
    : [];
  
  const teamALength = teamA.length;
  const teamBLength = teamB.length;
  const totalPlayers = teamALength + teamBLength;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size={"sm"} onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />{" "}
          {t("userNavigation.backButton")}
        </Button>
      </div>
      
      <Card className="mb-4">
        <CardHeader>
          <h3 className="text-center">
            {t("createPage.instructions")}
          </h3>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            onClick={copyTeamsList}
            disabled={isCopyLink}
          >
            <Copy size={20} className="mr-2" /> {t("createPage.copyTeamsList")}{" "}
            {isCopyLink && <Check size={20} className="ml-2" />}
          </Button>
        </CardContent>
        
        {matchInfo.playerList && matchInfo.playerList.length < 16 && (
          <CardFooter>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t("createPage.alerts.fewPlayers.title")}</AlertTitle>
              <AlertDescription>
                {t("createPage.alerts.fewPlayers.description", { count: matchInfo.playerList.length })}
              </AlertDescription>
            </Alert>
          </CardFooter>
        )}
      </Card>
      
      <div className="flex flex-col gap-2 mt-6">
        <h3 className="text-xl">{t("createPage.titleWhite")} ({teamALength})</h3>
        <div className="flex flex-col gap-2 mb-8 bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
          {teamALength > 0 ? (
            teamA.map((player: iUser) => (
              <div
                className="flex items-center w-full border p-2 bg-white dark:bg-slate-950 rounded-md cursor-pointer"
                key={player.uid}
                onClick={() => handleChangeTeam(player.uid)}
              >
                <div className="flex items-center w-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={player.avatar} alt={player.name} />
                    <AvatarFallback>{player.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <p className="px-3 truncate">{player.name}</p>
                </div>
                <div className="flex items-center gap-3 rounded-full border p-2 bg-white">
                  <Shirt size="16" color="black" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-4">{t("createPage.noPlayers")}</div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col gap-2 mt-2">
        <h3 className="text-xl">{t("createPage.titleBlack")} ({teamBLength})</h3>
        <div className="flex flex-col gap-2 mb-8 bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
          {teamBLength > 0 ? (
            teamB.map((player: iUser) => (
              <div
                className="flex items-center w-full border p-2 bg-white dark:bg-slate-950 rounded-md cursor-pointer"
                key={player.uid}
                onClick={() => handleChangeTeam(player.uid)}
              >
                <div className="flex items-center w-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={player.avatar} alt={player.name} />
                    <AvatarFallback>{player.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <p className="px-3 truncate">{player.name}</p>
                </div>
                <div className="flex items-center gap-3 rounded-full p-2 bg-black">
                  <Shirt size="16" color="white" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-4">{t("createPage.noPlayers")}</div>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateTeamPage;
