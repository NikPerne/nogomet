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
