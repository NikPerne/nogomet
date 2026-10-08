/*
 * Seasons run 1 October – 30 April; May – September belongs to the upcoming season
 * (mirrors api/config/season.js). Labels look like "2026/27".
 */
const MAY = 4;

const seasonLabel = (startYear: number): string =>
  `${startYear}/${String(startYear + 1).slice(-2)}`;

export const seasonLabelFor = (date: Date = new Date()): string =>
  seasonLabel(date.getMonth() >= MAY ? date.getFullYear() : date.getFullYear() - 1);

/**
 * "2026/27" shifted by -1 is "2025/26"
 */
export const shiftSeason = (season: string, by: number): string =>
  seasonLabel(Number(season.slice(0, 4)) + by);

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
