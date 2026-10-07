import { Signup } from "./signup";

export class Event {
  _id!: string;
  name!: string;
  description!: string;
  date!: Date;
  maxPlayers?: number | null;
  cancelled?: boolean;
  cancelReason?: string | null;
  signedup?: Signup[];
}

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
