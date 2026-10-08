const mongoose = require("mongoose");
const User = mongoose.model("User");
const Event = mongoose.model("Event");
const { parseLimit, isOwnSignup } = require("./helpers");

/**
 * Statistics for one user over played events (started, not cancelled, oldest first).
 * - gamesPlayed: events where the user was a confirmed player (not waitlisted)
 * - attendanceRate: gamesPlayed / events since the user's first signup (0..1)
 * - currentStreak: consecutive most recent events the user played
 * - lastPlayed: date of the most recent event the user played, or null
 */
const playerStats = (user, events) => {
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
  };
};

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get players' attendance statistics, most games first
 *     description: >
 *       Computed from started, non-cancelled events. gamesPlayed counts events where the user
 *       was a confirmed player (not waitlisted); attendanceRate is gamesPlayed divided by the
 *       events since the user's first signup; currentStreak counts consecutive recent games.
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: nResults
 *         description: Number of results to return (1-1000, default 10)
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: List of users with _id, name, gamesPlayed, attendanceRate, currentStreak and lastPlayed (may be empty)
 *       '500':
 *         description: Internal server error
 */
const userList = async (req, res) => {
  try {
    // Only expose public fields: never email, hash or salt
    const [users, events] = await Promise.all([
      User.find().select("name").exec(),
      Event.find({ date: { $lt: new Date() }, cancelled: { $ne: true } })
        .select("date maxPlayers signedup")
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
