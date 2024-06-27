"use client";
import { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface iUserListItem {
  avatar: string;
  name: string;
  actions?: ReactNode;
}

export default function UserListItemSquare({
  avatar,
  name,
  actions,
}: iUserListItem) {
  return (
    <div className="flex items-center justify-center p-4 rounded-md border-2 border-yellow-400 dark:bg-yellow-600 bg-yellow-100">
      <div className="flex flex-col items-center justify-center gap-2">
        <Avatar className="w-12 h-12">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <p className="text-center text-sm text-ellipsis overflow-hidden whitespace-nowrap w-28">
          {name}
        </p>
      </div>
      {actions}
    </div>
  );
}
