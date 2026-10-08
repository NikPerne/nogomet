export class PlayerStats {
  _id!: string;
  name!: string;
  gamesPlayed!: number;
  /** 0..1, games played divided by events since the player's first signup */
  attendanceRate!: number;
  currentStreak!: number;
  lastPlayed!: Date | null;
  /** From events with saved teams and a score */
  wins!: number;
  draws!: number;
  losses!: number;
  /** Matches where the player got the most player-of-the-match votes */
  mvpAwards!: number;
}

/**
 * One past match in a player's history (GET /api/users/:id)
 */
export interface PlayerMatch {
  _id: string;
  name: string;
  date: Date;
  /** played (confirmed), waitlisted, or declined ("Ne pridem") */
  status: "played" | "waitlisted" | "declined";
  team: "rumeni" | "rdeci" | null;
  result: "win" | "draw" | "loss" | null;
  score: { rumeni: number; rdeci: number } | null;
  mvp: boolean;
}

export interface PlayerHistory {
  player: PlayerStats;
  /** Newest first */
  matches: PlayerMatch[];
}
