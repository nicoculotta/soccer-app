"use client";
import { Trash } from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Switch } from "./ui/switch";
import { useTranslations } from "next-intl";
import { updateMatchInfo } from "@/lib/firebase";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

interface MatchCardProps {
  date: string;
  title: string;
  role: "admin" | "user" | "super";
  creator: {
    name: string;
    avatar: string;
  };
  onDelete: () => void;
  isActive: boolean;
  matchId: string;
  ownerName: string;
}

const MatchCard = ({
  matchId,
  date,
  title,
  role,
  creator,
  onDelete,
  isActive,
  ownerName,
}: MatchCardProps) => {
  const t = useTranslations("homePage");
  const { user } = useAuth();
  const [isMatchActive, setIsMatchActive] = useState<boolean>(isActive);
  const router = useRouter();
  const pathname = usePathname();

  const handleUpdateMatch = async (id: string, value: any) => {
    setIsMatchActive(value);
    updateMatchInfo(id, { available: value });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardDescription>{date}</CardDescription>
          {((role === "admin" && ownerName === user.name) ||
            role === "super") && (
            <Button variant="outline" size="icon" onClick={onDelete}>
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardFooter>
        <div className="w-full flex flex-col gap-2">
          {role === "admin" || role === "super" ? (
            <>
              <Button
                disabled={!isMatchActive}
                className="w-full"
                onClick={() => router.push(`${pathname}/${matchId}`)}
              >
                {isMatchActive
                  ? t("watchListButton")
                  : t("notAvailableListButton")}
              </Button>
              <div className="rounded-md border p-3 flex w-full justify-between items-center">
                <p className="text-slate-500 text-sm text-medium leading-none">
                  {isMatchActive ? t("listActive") : t("listDisabled")}
                </p>
                <Switch
                  checked={isMatchActive}
                  onCheckedChange={(event) => handleUpdateMatch(matchId, event)}
                />
              </div>
            </>
          ) : (
            <Button
              className="w-full"
              disabled={!isMatchActive}
              onClick={() => router.push(`${pathname}/${matchId}`)}
            >
              {isMatchActive
                ? t("watchListButton")
                : t("notAvailableListButton")}
            </Button>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={creator.avatar} alt={creator.name} />
              <AvatarFallback>{creator.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {t("creator")}: {creator.name}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MatchCard;
