import { formatDate } from "@angular/common";
import { Event, hasTimeOfDay } from "./event";
import { VENUE } from "./venue";

const EVENT_DURATION_MS = 90 * 60 * 1000;

/**
 * Escapes text for an iCalendar property value (RFC 5545, section 3.3.11)
 */
const escapeText = (text: string): string =>
  text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");

const utcStamp = (date: Date): string =>
  date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

const localDay = (date: Date): string => formatDate(date, "yyyyMMdd", "sl");

/**
 * Builds an .ics file for the event; events without a time become all-day events
 */
export const eventToIcs = (event: Event, url: string): string => {
  const start = new Date(event.date);
  const timing = hasTimeOfDay(event)
    ? [
        `DTSTART:${utcStamp(start)}`,
        `DTEND:${utcStamp(new Date(start.getTime() + EVENT_DURATION_MS))}`,
      ]
    : [
        `DTSTART;VALUE=DATE:${localDay(start)}`,
        `DTEND;VALUE=DATE:${localDay(
          new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1)
        )}`,
      ];
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Nogomet//Nogomet app//SL",
    "BEGIN:VEVENT",
    `UID:${event._id}@nogomet`,
    `DTSTAMP:${utcStamp(new Date())}`,
    ...timing,
    `SUMMARY:${escapeText(event.name)}`,
    `DESCRIPTION:${escapeText(`${event.description}\n${url}`)}`,
    `LOCATION:${escapeText(VENUE.name)}`,
    `URL:${url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
};
