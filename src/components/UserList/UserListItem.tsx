"use client";
import { ReactNode } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";

interface iUserListItem {
  avatar: string;
  name: string;
  actions?: ReactNode;
}

export default function UserListItem({ avatar, name, actions }: iUserListItem) {
  return (
    <div className="flex items-center justify-between p-4 rounded-md border">
      <div className="flex items-center gap-2">
        <Avatar className="w-6 h-6">
          <AvatarImage src={avatar} alt={name} />
        </Avatar>
        <span>{name}</span>
      </div>
      {actions}
    </div>
  );
}
