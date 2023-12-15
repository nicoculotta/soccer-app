export interface iUser {
  uid: string;
  email: string;
  name: string;
  provider: string;
  avatar: string;
  role: string;
}

export interface iMatch {
  id: string;
  available: boolean;
  date: string;
  time: string;
  playerList: iUser[];
  owner: iUser;
  day: string;
}
