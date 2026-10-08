const mongoose = require("mongoose");
const User = mongoose.model("User");
const Event = mongoose.model("Event");
const { parseLimit, isOwnSignup } = require("./helpers");
const { parseSeason } = require("../config/season");

/**
 * Statistics for one user over played events (started, not cancelled, oldest first).
 * - gamesPlayed: events where the user was a confirmed player (not waitlisted)
 * - attendanceRate: gamesPlayed / events since the user's first signup (0..1)
 * - currentStreak: consecutive most recent events the user played
 * - lastPlayed: date of the most recent event the user played, or null
 * - wins / draws / losses: from events with saved teams and a score
 * - mvpAwards: events where the user got the most player-of-the-match votes (ties count)
 */
const playerStats = (user, events) => {
  const results = { win: 0, draw: 0, loss: 0 };
  for (const event of events) {
    const result = event.resultFor(user);
    if (result) results[result]++;
  }
  const userKeys = [user._id.toString(), `name:${user.name}`];
  const mvpAwards = events.filter((event) =>
    event.mvpWinnerKeys().some((key) => userKeys.includes(key))
  ).length;
  const played = events.map((event) =>
    event.confirmedSignups().some((signup) => isOwnSignup(signup, user))
  );
  const firstSignup = events.findIndex((event) =>
    event.signedup.some((signup) => isOwnSignup(signup, user))
  );
  const eligible = firstSignup === -1 ? 0 : events.length - firstSignup;
  const gamesPlayed = played.filter(Boolean).length;

  let currentStreak = 0;
  for (let i = played.length - 1; i >= 0 && played[i]; i--) currentStreak++;
  const lastPlayedIndex = played.lastIndexOf(true);

  return {
    _id: user._id,
    name: user.name,
    gamesPlayed,
    attendanceRate: eligible ? Math.round((gamesPlayed / eligible) * 100) / 100 : 0,
    currentStreak,
    lastPlayed: lastPlayedIndex === -1 ? null : events[lastPlayedIndex].date,
    wins: results.win,
    draws: results.draw,
    losses: results.loss,
    mvpAwards,
  };
};

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get players' attendance statistics, most games first
 *     description: >
 *       Computed from started, non-cancelled events (optionally of one season). gamesPlayed
 *       counts events where the user was a confirmed player (not waitlisted); attendanceRate
 *       is gamesPlayed divided by the events since the user's first signup; currentStreak
 *       counts consecutive recent games; wins, draws and losses come from events with saved
 *       teams and a score; mvpAwards counts player-of-the-match wins.
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: nResults
 *         description: Number of results to return (1-1000, default 10)
 *         schema:
 *           type: integer
 *       - in: query
 *         name: season
 *         description: Only events of this season (October - April); all-time when missing
 *         example: 2025/26
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: List of users with _id, name, gamesPlayed, attendanceRate, currentStreak, lastPlayed, wins, draws, losses and mvpAwards (may be empty)
 *       '400':
 *         description: Invalid season
 *       '500':
 *         description: Internal server error
 */
const userList = async (req, res) => {
  const season = req.query.season ? parseSeason(req.query.season) : null;
  if (req.query.season && !season)
    return res.status(400).json({ message: "Parameter 'season' must look like '2026/27'." });
  const now = Date.now();
  const date = season
    ? { $gte: season.start, $lt: new Date(Math.min(season.end.getTime(), now)) }
    : { $lt: new Date(now) };
  try {
    // Only expose public fields: never email, hash or salt
    const [users, events] = await Promise.all([
      User.find().select("name").exec(),
      Event.find({ date, cancelled: { $ne: true } })
        .select("date maxPlayers signedup teams score mvpVotes")
        .sort({ date: 1 })
        .exec(),
    ]);
    const stats = users
      .map((user) => playerStats(user, events))
      .sort(
        (a, b) =>
          b.gamesPlayed - a.gamesPlayed ||
          b.attendanceRate - a.attendanceRate ||
          a.name.localeCompare(b.name)
      )
      .slice(0, parseLimit(req.query.nResults));
    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  userList,
};
