"use client";
import SearchInput from "@/components/SearchInput/SearchInput";
import { HomeSkeleton } from "@/components/Skeletons/HomeSkeleton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import UserList from "@/components/UserList/UserList";
import UserListItem from "@/components/UserList/UserListItem";
import {
  addYellowCard,
  addYellowProp,
  getAllUsers,
  searchUsers,
  usersWithYellowCard,
} from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { iUser } from "@/types/types";
import { ChevronLeft, CreditCard } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const YellowPage = () => {
  const locale = useLocale();
  const t = useTranslations();
  const [users, setUsers] = useState<iUser[] | []>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userResult, setUserResult] = useState<iUser[] | []>([]);

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
  }, [userResult]);

  const handleYellowCard = async (uid: string, value: boolean) => {
    if (value) {
      await addYellowCard(uid, { yellow: false });
    } else {
      await addYellowCard(uid, { yellow: true });
    }

    const updatedUsers = users.map((user) => {
      if (user.uid === uid) {
        return {
          ...user,
          yellow: value ? false : true,
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    setUserResult([]);
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      setUserResult([]);
      return;
    }
    const result = await searchUsers(searchQuery);
    setUserResult(result as iUser[]);
    setSearchQuery("");
  };

  if (!users) return <HomeSkeleton />;

  return (
    <div>
      <Button onClick={addYellowProp}>agregar prop tarjeta</Button>
      <>
        <div className="flex items-center justify-between mb-4">
          <Link href={`/${locale}/admin`}>
            <Button variant="outline" size={"sm"}>
              <ChevronLeft className="mr-2 h-4 w-4" />{" "}
              {t("userNavigation.backButton")}
            </Button>
          </Link>
        </div>
        <div className="mb-10 space-y-4">
          <h3 className="text-xl mb-4">Sacar Amarilla</h3>
          <SearchInput
            query={searchQuery}
            setQuery={setSearchQuery}
            handleSearch={handleSearch}
          />
          {userResult.map((item) => (
            <UserListItem
              key={item.uid}
              avatar={item.avatar}
              name={item.name}
              actions={
                <YellowCard
                  hasYellow={item.yellow}
                  onClick={() => handleYellowCard(item.uid, item.yellow)}
                />
              }
            />
          ))}
        </div>
        {users.length > 0 && (
          <UserList title={t("adminPage.YellowTitle")}>
            {users.map((item) => (
              <UserListItem
                key={item.uid}
                avatar={item.avatar}
                name={item.name}
                actions={
                  <YellowCard
                    hasYellow={item.yellow}
                    onClick={() => handleYellowCard(item.uid, item.yellow)}
                  />
                }
              />
            ))}
          </UserList>
        )}
      </>
    </div>
  );
};

export default YellowPage;

const YellowCard = ({
  hasYellow,
  onClick,
}: {
  hasYellow: boolean;
  onClick: () => void;
}) => {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className={cn(hasYellow ? "bg-yellow-500" : "opacity-50")}
    >
      <CreditCard />
    </Button>
  );
};
