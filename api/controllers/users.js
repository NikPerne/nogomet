const mongoose = require("mongoose");
const User = mongoose.model("User");
const Event = mongoose.model("Event");
const { parseLimit } = require("./helpers");

/**
 * Counts, per user, the started events where they were a confirmed player
 * (attending and not on the waitlist). Legacy signups without userId count by name.
 */
const countGamesPlayed = (events) => {
  const byUserId = new Map();
  const byName = new Map();
  const increment = (map, key) => map.set(key, (map.get(key) ?? 0) + 1);
  for (const event of events)
    for (const signup of event.confirmedSignups()) {
      if (signup.userId) increment(byUserId, signup.userId.toString());
      else increment(byName, signup.name);
    }
  return { byUserId, byName };
};

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get players' attendance statistics, most games first
 *     description: gamesPlayed counts started events where the user was a confirmed player (not waitlisted).
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: nResults
 *         description: Number of results to return (1-1000, default 10)
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: List of users with _id, name and gamesPlayed (may be empty)
 *       '500':
 *         description: Internal server error
 */
const userList = async (req, res) => {
  try {
    // Only expose public fields: never email, hash or salt
    const [users, events] = await Promise.all([
      User.find().select("name").exec(),
      Event.find({ date: { $lt: new Date() } })
        .select("date maxPlayers signedup")
        .exec(),
    ]);
    const { byUserId, byName } = countGamesPlayed(events);
    const stats = users
      .map((user) => ({
        _id: user._id,
        name: user.name,
        gamesPlayed:
          (byUserId.get(user._id.toString()) ?? 0) + (byName.get(user.name) ?? 0),
      }))
      .sort((a, b) => b.gamesPlayed - a.gamesPlayed || a.name.localeCompare(b.name))
      .slice(0, parseLimit(req.query.nResults));
    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  userList,
};
