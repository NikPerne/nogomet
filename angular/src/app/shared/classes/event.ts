import { Signup } from "./signup";

export type TeamKey = "rumeni" | "rdeci";

export interface TeamPlayer {
  name: string;
  /** Missing for guests and legacy signups */
  userId?: string;
  guest?: boolean;
}

export type Teams = Record<TeamKey, TeamPlayer[]>;
export type Score = Record<TeamKey, number>;

/**
 * The two teams, in display order (bib colours: yellow and red)
 */
export const TEAMS: readonly { key: TeamKey; label: string; emoji: string; color: string }[] = [
  { key: "rumeni", label: "Rumeni", emoji: "🟡", color: "#f2c200" },
  { key: "rdeci", label: "Rdeči", emoji: "🔴", color: "#d62828" },
];

export class Event {
  _id!: string;
  name!: string;
  description!: string;
  date!: Date;
  maxPlayers?: number | null;
  cancelled?: boolean;
  cancelReason?: string | null;
  signedup?: Signup[];
  /** Saved line-up (set by an admin), visible to everyone */
  teams?: Teams | null;
  score?: Score | null;
  /** Player-of-the-match votes per player, most first (who voted is secret) */
  mvpTally?: MvpTallyEntry[];
}

export interface MvpTallyEntry {
  /** Player key, see playerKey() */
  key: string;
  name: string;
  votes: number;
}

/**
 * Identifies a player across signups, teams and votes: the userId, or "guest:<name>" /
 * "name:<name>" for players without one (mirrors playerKeyOf in api/models/events.js)
 */
export const playerKey = (player: {
  userId?: string;
  name: string;
  guest?: boolean;
  guestOf?: string;
}): string =>
  player.userId ?? `${player.guest || player.guestOf ? "guest" : "name"}:${player.name}`;

/** Voting opens at kick-off and stays open for a week (as in the API) */
const MVP_VOTING_MS = 7 * 24 * 60 * 60 * 1000;

export const isMvpVotingOpen = (event: Event): boolean => {
  const start = new Date(event.date).getTime();
  return !event.cancelled && Date.now() >= start && Date.now() < start + MVP_VOTING_MS;
};

/*
 * These mirror the Event model methods in api/models/events.js; keep them in sync
 */

/**
 * Signups stay open for 24 h after the start, since older events have no time of day
 */
const SIGNUP_GRACE_MS = 24 * 60 * 60 * 1000;

export const isEventPast = (event: Event): boolean =>
  new Date(event.date).getTime() + SIGNUP_GRACE_MS < Date.now();

/**
 * Signups can't be added or changed for past or cancelled events
 */
export const areSignupsClosed = (event: Event): boolean =>
  !!event.cancelled || isEventPast(event);

/**
 * Attending signups in the order they said "Pridem" (legacy signups use createdOn)
 */
export const attendingInOrder = (event: Event): Signup[] => {
  const since = (signup: Signup) =>
    new Date(signup.attendingSince ?? signup.createdOn ?? 0).getTime();
  return (event.signedup ?? [])
    .filter((signup) => signup.attending)
    .sort((a, b) => since(a) - since(b));
};

/**
 * The first maxPlayers attending signups play; the rest are on the waitlist
 */
export const confirmedSignups = (event: Event): Signup[] => {
  const attending = attendingInOrder(event);
  return event.maxPlayers ? attending.slice(0, event.maxPlayers) : attending;
};

export const waitlistedSignups = (event: Event): Signup[] =>
  event.maxPlayers ? attendingInOrder(event).slice(event.maxPlayers) : [];

export const isEventFull = (event: Event): boolean =>
  !!event.maxPlayers && attendingInOrder(event).length >= event.maxPlayers;

/**
 * Start time suggested for new events and for older events without a time
 */
export const DEFAULT_EVENT_TIME = "20:00";

/**
 * Events created before times were added are stored at local midnight
 */
export const hasTimeOfDay = (event: Event): boolean => {
  const date = new Date(event.date);
  return date.getHours() !== 0 || date.getMinutes() !== 0;
};
