import { Signup } from "./signup";

export class Event {
  _id!: string;
  name!: string;
  description!: string;
  date!: Date;
  maxPlayers?: number | null;
  signedup?: Signup[];
}

/**
 * Events only have a date, so signups stay open until the end of the event's day
 * (mirrors Event.isPast() in api/models/events.js)
 */
const SIGNUP_GRACE_MS = 24 * 60 * 60 * 1000;

export const isEventPast = (event: Event): boolean =>
  new Date(event.date).getTime() + SIGNUP_GRACE_MS < Date.now();

export const attendingCount = (event: Event): number =>
  event.signedup?.filter((signup) => signup.attending).length ?? 0;

export const isEventFull = (event: Event): boolean =>
  !!event.maxPlayers && attendingCount(event) >= event.maxPlayers;
