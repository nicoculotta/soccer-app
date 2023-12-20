import { X } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

interface iPlayerListItem {
  avatar: string;
  name: string;
  number: number;
  role: string;
  deleteIcon: boolean;
  onDelete: () => void;
}

const PlayerListItem = ({
  avatar,
  name,
  number,
  deleteIcon,
  role,
  onDelete,
}: iPlayerListItem) => {
  return (
    <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900 py-2 px-4 rounded-md">
      <div className="flex items-center w-full">
        {deleteIcon && (
          <Button className="p-2 mr-2" variant="ghost" onClick={onDelete}>
            <X size={16} />
          </Button>
        )}
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <p className="px-3 truncate">{name}</p>
      </div>
      <div className="flex items-center gap-3">
        {(role === "admin" || role === "super") && (
          <span className="text-xs text-muted-foreground">Admin</span>
        )}
        <span>{number}</span>
      </div>
    </div>
  );
};

export default PlayerListItem;
