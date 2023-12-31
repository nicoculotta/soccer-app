import { iPlayerListItemDraggable } from "@/types/types";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React from "react";
import PlayerListItemDraggable from "./PlayerListItemDraggable";

interface iPlayerListAreaSortable {
  id: string;
  players: iPlayerListItemDraggable[];
  title: string;
}

const PlayerListAreaSortable = ({
  id,
  players,
  title,
}: iPlayerListAreaSortable) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <SortableContext
      id={id}
      items={players}
      strategy={verticalListSortingStrategy}
    >
      <div ref={setNodeRef} className="flex flex-col gap-2 mt-3 mb-8">
        <h3 className="text-xl">{title}</h3>
        {players.map((player) => (
          <PlayerListItemDraggable
            id={player.id}
            key={player.id}
            avatar={player.avatar}
            name={player.name}
            role={player.role}
          />
        ))}
      </div>
    </SortableContext>
  );
};

export default PlayerListAreaSortable;
