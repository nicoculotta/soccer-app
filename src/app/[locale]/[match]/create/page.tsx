"use client";
import { useMatch } from "@/context/matchContext";
import React, { useEffect } from "react";
import { iMatch, iUser } from "@/types/types";
import { useTranslations } from "next-intl";
import { Check, ChevronLeft, Copy, Shirt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateMatchInfo } from "@/lib/firebase";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const CreateTeamPage = ({ params }: { params: { match: string } }) => {
  const router = useRouter();
  const t = useTranslations();
  const { matchInfo, setMatchInfo, copyTeamsList, isCopyLink } = useMatch();

  function findContainer(id: string): string | undefined {
    return Object.keys(matchInfo.teams).find((key) =>
      matchInfo.teams[key].some((player: iUser) => player.uid === id)
    );
  }

  function savePlayerList(matchId: string, data: any) {
    updateMatchInfo(matchId, data);
  }

  function handleChangeTeam(id: string) {
    const activeTeam = findContainer(id) as string;
    const otherTeam = activeTeam === "teamA" ? "teamB" : "teamA";
    const activePlayer = matchInfo.teams[activeTeam].find(
      (player: iUser) => player.uid === id
    );
    const restOfPlayers = matchInfo.teams[activeTeam as string].filter(
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

  useEffect(() => {
    if (matchInfo && !matchInfo.hasOwnProperty("teams")) {
      savePlayerList(params.match, {
        teams: {
          teamA: matchInfo.playerList.slice(0, 8) || [],
          teamB: matchInfo.playerList.slice(8, 16) || [],
        },
      });
    }
  }, [matchInfo]);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size={"sm"} onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />{" "}
          {t("userNavigation.backButton")}
        </Button>
      </div>
      <Card>
        <CardHeader>
          <h3 className="text-center">
            Para cambiar un jugador de equipo pulsar sobre un jugador para
            cambiarlo
          </h3>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            onClick={copyTeamsList}
            disabled={isCopyLink}
          >
            <Copy size={20} className="mr-2" /> Copiar Lista de Equipos{" "}
            {isCopyLink && <Check size={20} className="ml-2" />}
          </Button>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-2 mt-6">
        <h3 className="text-xl">{t("createPage.titleWhite")}</h3>
        <div className="flex flex-col gap-2 mb-8 bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
          {matchInfo?.teams?.teamA.map((player: iUser) => (
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
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <h3 className="text-xl">{t("createPage.titleBlack")}</h3>
        <div className="flex flex-col gap-2 mb-8 bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
          {matchInfo?.teams?.teamB.map((player: iUser) => (
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
          ))}
        </div>
      </div>
    </>
  );
};

export default CreateTeamPage;
