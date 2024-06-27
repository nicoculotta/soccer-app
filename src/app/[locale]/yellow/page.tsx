"use client";

import { HomeSkeleton } from "@/components/Skeletons/HomeSkeleton";
import { Button } from "@/components/ui/button";
import UserList from "@/components/UserList/UserList";
import UserListItem from "@/components/UserList/UserListItem";
import { getAllUsers, usersWithYellowCard } from "@/lib/firebase";
import { iUser } from "@/types/types";
import { ChevronLeft, MoveUpLeft, Smile } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import UserListItemSquare from "@/components/UserList/UserListItemSquare";
import UserListSquare from "@/components/UserList/UserListSquare";

export default function YellowPage() {
  const t = useTranslations();
  const [users, setUsers] = useState<iUser[] | []>([]);

  const fetchUsers = async () => {
    try {
      const data = await usersWithYellowCard();
      setUsers(data as iUser[]);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (!users) return <HomeSkeleton />;

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <Link href="/">
          <Button variant="outline" size={"sm"}>
            <ChevronLeft className="mr-2 h-4 w-4" />{" "}
            {t("userNavigation.backButton")}
          </Button>
        </Link>
      </div>
      {users.length > 0 ? (
        <UserListSquare title={t("homePage.yellowButton")}>
          {users.map((item) => (
            <UserListItemSquare
              key={item.uid}
              avatar={item.avatar}
              name={item.name}
            />
          ))}
        </UserListSquare>
      ) : (
        <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 px-6 h-48 rounded-md">
          <div className="rounded-full h-12 w-12 flex items-center justify-center bg-slate-200 dark:bg-slate-800 mb-3 ">
            <Smile size={24} />
          </div>
          <h3 className="text-muted-foreground text-center">
            {t("homePage.noYellowCard")}
          </h3>
        </div>
      )}
    </>
  );
}
