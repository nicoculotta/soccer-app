import { useAuth } from "@/context/authContext";
import { useMatch } from "@/context/matchContext";
import { updateMatchInfo } from "@/lib/firebase";
import { generateFakeUsers } from "@/utils/randomNames";
import { useTranslations } from "next-intl";
import React from "react";
import PlayerList from "../PlayerList/PlayerList";
import DiscardSheetModal from "../SheetModal/DiscardSheetModal";
import { Button } from "../ui/button";

const MatchPlayerList = () => {
  const t = useTranslations();
  const { user } = useAuth();
  const { matchInfo, isDiscardOpen, setIsDiscardOpen, setMatchInfo } =
    useMatch();

  const morePlayers = generateFakeUsers(20);

  const addFakePlayers = () => {
    const players = matchInfo.playerList;
    updateMatchInfo(matchInfo.id, {
      playerList: [...players, ...morePlayers],
    });
    setMatchInfo({ ...matchInfo, playerList: [...players, ...morePlayers] });
  };

  return (
    <>
      {false && (
        <Button onClick={addFakePlayers}>Agregar jugadores FAKE</Button>
      )}
      <PlayerList
        title={t("matchPage.players")}
        list={matchInfo?.playerList.slice(0, 16) || []}
        isAdmin={user?.role === "admin"}
      />

      {matchInfo && matchInfo.playerList.length > 16 && (
        <PlayerList
          title={t("matchPage.backup")}
          list={matchInfo.playerList.slice(16) || []}
          isAdmin={user && user.role === "admin"}
        />
      )}

      <DiscardSheetModal isOpen={isDiscardOpen} setIsOpen={setIsDiscardOpen} />
    </>
  );
};

export default MatchPlayerList;
