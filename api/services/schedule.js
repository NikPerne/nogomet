const mongoose = require("mongoose");
const Event = mongoose.model("Event");
const { addDaysInZone } = require("./time");

/**
 * Weekly events are created automatically unless AUTO_WEEKLY_EVENTS=false
 */
const autoWeeklyEnabled = () => process.env.AUTO_WEEKLY_EVENTS !== "false";

/**
 * When no upcoming event exists, creates the next weekly match: a copy of the latest
 * event (name, description, local kick-off time, player limit) one or more weeks later,
 * the first such date in the future. Run daily, the next match appears the day after
 * the previous one. Returns the created event, or null.
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
  const event = await Event.create({
    name: latest.name,
    description: latest.description,
    date,
    maxPlayers: latest.maxPlayers,
    signedup: [],
  });
  console.log(`Weekly event ${event._id} created for ${date.toISOString()}.`);
  return event;
};

module.exports = { createNextWeeklyEvent };
