const mongoose = require("mongoose");
const Event = mongoose.model("Event");
const { addDaysInZone, calendarDaysBetween } = require("./time");

/**
 * Weekly events are created automatically unless AUTO_WEEKLY_EVENTS=false
 */
const autoWeeklyEnabled = () => process.env.AUTO_WEEKLY_EVENTS !== "false";

/**
 * AUTO_EVENT_DAYS_BEFORE: create the next match only when it is at most this many calendar
 * days away (e.g. 2: Sunday for a Tuesday match). Unset: as soon as the previous one is over.
 */
const daysBefore = () => {
  const days = parseInt(process.env.AUTO_EVENT_DAYS_BEFORE, 10);
  return Number.isInteger(days) && days >= 0 ? days : null;
};

/**
 * AUTO_EVENT_MAX_PLAYERS: "none" for no limit, a number for a fixed limit,
 * unset to copy the latest event's limit
 */
const maxPlayersFor = (latest) => {
  const setting = process.env.AUTO_EVENT_MAX_PLAYERS?.trim().toLowerCase();
  if (!setting) return latest.maxPlayers;
  if (setting === "none" || setting === "0") return undefined;
  const limit = parseInt(setting, 10);
  return Number.isInteger(limit) && limit > 0 ? limit : latest.maxPlayers;
};

/**
 * When no upcoming event exists, creates the next weekly match: a copy of the latest
 * event (name, description, local kick-off time and player limit, see AUTO_EVENT_MAX_PLAYERS)
 * one or more weeks later, the first such date in the future - but only once that date is
 * within AUTO_EVENT_DAYS_BEFORE days. Meant to run daily. Returns the created event, or null.
 */
const createNextWeeklyEvent = async (now = new Date()) => {
  if (!autoWeeklyEnabled()) return null;
  const upcoming = await Event.exists({ date: { $gt: now } });
  if (upcoming) return null;
  const latest = await Event.findOne()
    .sort({ date: -1 })
    .select("name description date maxPlayers")
    .exec();
  if (!latest) return null;

  let date = latest.date;
  do date = addDaysInZone(date, 7);
  while (date <= now);
  const days = daysBefore();
  if (days !== null && calendarDaysBetween(now, date) > days) return null;

  const event = await Event.create({
    name: latest.name,
    description: latest.description,
    date,
    maxPlayers: maxPlayersFor(latest),
    signedup: [],
  });
  console.log(`Weekly event ${event._id} created for ${date.toISOString()}.`);
  return event;
};

module.exports = { createNextWeeklyEvent };
