export class PlayerStats {
  _id!: string;
  name!: string;
  gamesPlayed!: number;
  /** 0..1, games played divided by events since the player's first signup */
  attendanceRate!: number;
  currentStreak!: number;
  lastPlayed!: Date | null;
}
