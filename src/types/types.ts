export interface iUser {
  uid: string;
  email: string;
  name: string;
  provider: string;
  avatar: string;
  role: string;
  yellow: boolean;
}

export interface iMatch {
  id: string;
  available: boolean;
  date: string;
  time: string;
  playerList: iUser[];
  owner: iUser;
  day: string;
  teams: {
    teamA: iUser[];
    teamB: iUser[];
  };
  lastPlayerAction?: {
    type: string;
    playerIndex: number;
    reservePlayerMovingUp: iUser | null;
    spacesLeft: number;
    timestamp?: number;
  };
}
