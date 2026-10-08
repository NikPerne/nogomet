/**
 * Wall-clock helpers for the club's time zone. The server runs in UTC, but kick-off
 * times are local (e.g. Tuesdays at 18:00 in Ljubljana), including across DST changes.
 */
const TIME_ZONE = "Europe/Ljubljana";

/**
 * Local date and time parts of an instant in TIME_ZONE
 */
const zonedParts = (date) => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)])
  );
  return parts; // { year, month (1-12), day, hour, minute }
};

/**
 * Offset of TIME_ZONE from UTC at an instant, in milliseconds (e.g. +2h in summer)
 */
const offsetAt = (date) => {
  const p = zonedParts(date);
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - (date.getTime() - (date.getTime() % 60000));
};

/**
 * The instant that shows the given local wall-clock time in TIME_ZONE
 */
const fromZoned = (year, month, day, hour, minute) => {
  const asUtc = Date.UTC(year, month - 1, day, hour, minute);
  // Two passes settle the offset on either side of a DST switch
  let instant = asUtc - offsetAt(new Date(asUtc));
  instant = asUtc - offsetAt(new Date(instant));
  return new Date(instant);
};

/**
 * Same local wall-clock time, `days` later (keeps 18:00 at 18:00 across DST changes)
 */
const addDaysInZone = (date, days) => {
  const p = zonedParts(date);
  return fromZoned(p.year, p.month, p.day + days, p.hour, p.minute);
};

module.exports = { TIME_ZONE, zonedParts, addDaysInZone };
