"use client";
import { ReactNode } from "react";

interface iUserList {
  title: string;
  children: ReactNode;
}

export default function UserList({ title, children }: iUserList) {
  return (
    <div className="grid gap-4">
      <h3 className="text-xl">{title}</h3>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2">{children}</div>
    </div>
  );
}
