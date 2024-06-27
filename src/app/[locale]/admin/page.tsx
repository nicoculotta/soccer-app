"use client";

import { HomeSkeleton } from "@/components/Skeletons/HomeSkeleton";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import UserList from "@/components/UserList/UserList";
import UserListItem from "@/components/UserList/UserListItem";
import { USER_ROLES } from "@/config";
import { getAllUsers, searchUsers, updateUserRole } from "@/lib/firebase";
import { iUser } from "@/types/types";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import SearchInput from "@/components/SearchInput/SearchInput";

export default function AdminPage() {
  const locale = useLocale();
  const t = useTranslations();
  const [users, setUsers] = useState<iUser[] | []>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userResult, setUserResult] = useState<iUser[] | []>([]);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSwitch = async (id: string, role: string) => {
    try {
      let newRole =
        role === USER_ROLES.IS_ADMIN ? USER_ROLES.IS_USER : USER_ROLES.IS_ADMIN;
      await updateUserRole(id, { role: newRole as "admin" | "user" });

      const updatedUsers = users.map((user) => {
        if (user.uid === id) {
          return {
            ...user,
            role: newRole,
          };
        }
        return user;
      });

      setUsers(updatedUsers);
      setUserResult([]);
    } catch (error) {
      console.error("Error al cambiar el rol del usuario:", error);
    }
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
    <>
      <div className="flex items-center gap-4 mb-4">
        <Link href="/">
          <Button variant="outline" size={"sm"}>
            <ChevronLeft className="mr-2 h-4 w-4" />{" "}
            {t("userNavigation.backButton")}
          </Button>
        </Link>
        <Link href={`admin/yellow-card`}>
          <Button variant="outline" size={"sm"}>
            Tarjetas
          </Button>
        </Link>
      </div>
      <div className="mb-10 space-y-4">
        <h3 className="text-xl mb-4">Usuarios</h3>
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
              <Switch
                checked={item.role !== USER_ROLES.IS_USER}
                onCheckedChange={() => handleSwitch(item.uid, item.role)}
              />
            }
          />
        ))}
      </div>
      <UserList title={t("adminPage.UsersTitle")}>
        {
          <>
            {users
              .filter((user) => user.role !== "user")
              .map((item) => (
                <UserListItem
                  key={item.uid}
                  avatar={item.avatar}
                  name={item.name}
                  actions={
                    <Switch
                      checked={item.role !== USER_ROLES.IS_USER}
                      onCheckedChange={() => handleSwitch(item.uid, item.role)}
                    />
                  }
                />
              ))}
          </>
        }
      </UserList>
    </>
  );
}
