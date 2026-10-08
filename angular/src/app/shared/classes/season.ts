export class SeasonPlayer {
  _id!: string;
  name!: string;
  /** Games played this season as a confirmed player */
  gamesPlayed!: number;
  paid!: boolean;
  paidOn!: Date | null;
}

export class SeasonOverview {
  /** Season label, e.g. "2026/27" (1 October – 30 April) */
  season!: string;
  start!: Date;
  end!: Date;
  /** Season membership fee in EUR */
  fee!: number;
  players!: SeasonPlayer[];
  paidCount!: number;
  collected!: number;
}
