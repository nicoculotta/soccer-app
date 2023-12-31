"use client";
import { useMatch } from "@/context/matchContext";
import { generateFakeUsers } from "@/utils/randomNames";
import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { iPlayerListItemDraggable, iUser } from "@/types/types";
import PlayerListAreaSortable from "@/components/PlayerList/PlayerListAreaSortable";
import { useTranslations } from "next-intl";
import { ChevronLeft, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface iPlayerList {
  [key: string]: iPlayerListItemDraggable[];
}

const CreateTeamPage = () => {
  const router = useRouter();
  const t = useTranslations();
  const { matchInfo, copyMessage } = useMatch();

  const [playerList, setPlayerList] = useState<iPlayerList>({
    teamA: [],
    teamB: [],
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function findContainer(id: string): string | undefined {
    return Object.keys(playerList).find((key) =>
      playerList[key].some((player) => player.id === id)
    );
  }

  function handleDragOver(event: any) {
    const { active, over, draggingRect } = event;

    // Find the containers
    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setPlayerList((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      // Find the indexes for the items
      const activeIndex = activeItems.findIndex(
        (elem) => elem.id === active.id
      );
      const overIndex = overItems.findIndex((elem) => elem.id === over.id);

      const isIdInPrev =
        activeItems.some((item) => item.id === over.id) ||
        overItems.some((item) => item.id === over.id);

      let newIndex;
      if (isIdInPrev) {
        // We're at the root droppable of a container
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem =
          over &&
          overIndex === overItems.length - 1 &&
          draggingRect.offsetTop > over.rect.offsetTop + over.rect.height;

        const modifier = isBelowLastItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      // Remove the active item from activeItems array
      const updatedActiveItems = [
        ...activeItems.slice(0, activeIndex),
        ...activeItems.slice(activeIndex + 1),
      ];

      return {
        ...prev,
        [activeContainer]: updatedActiveItems,
        [overContainer]: [
          ...overItems.slice(0, newIndex),
          playerList[activeContainer][activeIndex],
          ...overItems.slice(newIndex, overItems.length),
        ],
      };
    });
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    const activeIndex = playerList[activeContainer].findIndex(
      (elem) => elem.id === active.id
    );
    const overIndex = playerList[overContainer].findIndex(
      (elem) => elem.id === over.id
    );

    if (activeIndex !== overIndex) {
      setPlayerList((items) => ({
        ...items,
        [overContainer]: arrayMove(
          playerList[overContainer],
          activeIndex,
          overIndex
        ),
      }));
    }
  }

  useEffect(() => {
    if (matchInfo) {
      setPlayerList({
        teamA:
          matchInfo.playerList.slice(0, 7).map((player: iUser) => {
            const { uid, ...rest } = player;
            return { id: uid, ...rest };
          }) || [],
        teamB:
          matchInfo.playerList.slice(8, 13).map((player: iUser) => {
            const { uid, ...rest } = player;
            return { id: uid, ...rest };
          }) || [],
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
      <div className="my-6">
        <Button
          className="w-full"
          onClick={() => copyMessage("lista de jugadores")}
        >
          <Copy size={20} className="mr-2" /> Copiar Equipos
        </Button>
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        sensors={sensors}
      >
        <PlayerListAreaSortable
          title={t("createPage.titleWhite")}
          id={"teamA"}
          players={playerList.teamA}
        />
        <PlayerListAreaSortable
          title={t("createPage.titleBlack")}
          id={"teamB"}
          players={playerList.teamB}
        />
      </DndContext>
    </>
  );
};

export default CreateTeamPage;
