import { iUser } from "@/types/types";

export interface iPlayer {
  name: string;
  avatar: string;
  role: "admin" | "user";
}

export interface iMatch {
  id: string;
  available: boolean;
  date: string;
  time: string;
  playerList: iPlayer[];
  owner: iUser;
  day: string;
}
