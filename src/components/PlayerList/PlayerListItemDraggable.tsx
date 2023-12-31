import { cn } from "@/lib/utils";
import { iPlayerListItemDraggable } from "@/types/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const PlayerListItemDraggable = ({
  id,
  avatar,
  name,
  number,
  role,
}: iPlayerListItemDraggable) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      style={style}
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      className={cn(
        '"flex items-center justify-between bg-slate-100 dark:bg-slate-900 py-2 px-4 rounded-md touch-none"'
      )}
    >
      <div className="flex items-center w-full">
        <Button className="p-2 mr-2" variant="ghost">
          <GripVertical size={16} />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <p className="px-3 truncate">{name}</p>
      </div>
    </div>
  );
};

export default PlayerListItemDraggable;
