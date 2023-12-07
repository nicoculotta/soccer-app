"use client";
import { Delete, DeleteIcon, Trash } from "lucide-react";
import React, { useState } from "react";
import { StringValidation } from "zod";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Switch } from "./ui/switch";

interface MatchCardProps {
  date: string;
  title: string;
  role: "admin" | "user" | "super";
  creator: {
    name: string;
    avatar: string;
  };
  onDelete: () => void;
}

const MatchCard = ({
  date,
  title,
  role,
  creator,
  onDelete,
}: MatchCardProps) => {
  const [isActive, setIsActive] = useState(true);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardDescription>{date}</CardDescription>
          {(role === "admin" || role === "super") && (
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
              <Button disabled={isActive} className="w-full">
                {isActive ? "Lista no disponible" : "Ver lista"}
              </Button>
              <div className="rounded-md border p-3 flex w-full justify-between items-center">
                <p className="text-slate-500 text-sm text-medium leading-none">
                  {isActive ? "Lista Desactivada" : "Lista Activa"}
                </p>
                <Switch
                  checked={!isActive}
                  onCheckedChange={(event) => setIsActive(!event)}
                />
              </div>
            </>
          ) : (
            <Button className="w-full" disabled={isActive}>
              {isActive ? "Lista no disponible" : "Ver lista"}
            </Button>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={creator.avatar} alt={creator.name} />
            </Avatar>
            <span className="text-sm text-muted-foreground">
              Creator: {creator.name}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MatchCard;
