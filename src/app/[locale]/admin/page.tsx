"use client";

import { HomeSkeleton } from "@/components/Skeletons/HomeSkeleton";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import UserList from "@/components/UserList/UserList";
import UserListItem from "@/components/UserList/UserListItem";
import { USER_ROLES } from "@/config";
import { getAllUsers, updateUserRole } from "@/lib/firebase";
import { iUser } from "@/types/types";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function AdminPage() {
  const t = useTranslations();
  const [users, setUsers] = useState<iUser[] | []>([]);

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
    } catch (error) {
      console.error("Error al cambiar el rol del usuario:", error);
    }
  };

  if (!users) return <HomeSkeleton />;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Link href="/">
          <Button variant="outline" size={"sm"}>
            <ChevronLeft className="mr-2 h-4 w-4" />{" "}
            {t("userNavigation.backButton")}
          </Button>
        </Link>
      </div>
      <UserList title={t("adminPage.UsersTitle")}>
        {
          <>
            {users.map((item) => (
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
