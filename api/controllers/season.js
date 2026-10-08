const mongoose = require("mongoose");
const User = mongoose.model("User");
const Event = mongoose.model("Event");
const SeasonPayment = mongoose.model("SeasonPayment");
const { isValidId, parseBoolean, isOwnSignup } = require("./helpers");
const { SEASON_FEE_EUR, seasonFor, parseSeason } = require("../config/season");

const invalidSeason = (res) =>
  res
    .status(400)
    .json({ message: "Parameter 'season' must look like '2026/27'." });

/**
 * @openapi
 * /season:
 *   get:
 *     summary: Season membership fees overview
 *     description: >
 *       Lists players of a season (1 October – 30 April) with their payment status. A player
 *       is anyone who said "Pridem" for a non-cancelled event in the season, or has already
 *       paid. gamesPlayed counts started events where they were a confirmed player.
 *     tags: [Season]
 *     security:
 *      - jwt: []
 *     parameters:
 *       - in: query
 *         name: season
 *         description: Season label (default is the current or upcoming season)
 *         example: 2026/27
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Season label, start/end dates, fee, players with payment status, paidCount and collected
 *       '400':
 *         description: Invalid season parameter
 *       '401':
 *         description: Not authenticated
 *       '500':
 *         description: Internal server error
 */
const seasonOverview = async (req, res) => {
  const season = req.query.season ? parseSeason(req.query.season) : seasonFor();
  if (!season) return invalidSeason(res);
  try {
    const [users, events, payments] = await Promise.all([
      User.find().select("name").exec(),
      Event.find({
        date: { $gte: season.start, $lt: season.end },
        cancelled: { $ne: true },
      })
        .select("date maxPlayers signedup")
        .exec(),
      SeasonPayment.find({ season: season.label }).exec(),
    ]);
    const paidOn = new Map(
      payments.map((payment) => [payment.userId.toString(), payment.paidOn])
    );
    const now = Date.now();
    const players = users
      .map((user) => {
        const attending = events.some((event) =>
          event.signedup.some(
            (signup) => signup.attending && isOwnSignup(signup, user)
          )
        );
        const gamesPlayed = events.filter(
          (event) =>
            event.date.getTime() < now &&
            event.confirmedSignups().some((signup) => isOwnSignup(signup, user))
        ).length;
        const paid = paidOn.get(user._id.toString());
        return {
          _id: user._id,
          name: user.name,
          gamesPlayed,
          paid: !!paid,
          paidOn: paid ?? null,
          attending,
        };
      })
      .filter((player) => player.attending || player.paid)
      .map(({ attending, ...player }) => player)
      .sort((a, b) => a.name.localeCompare(b.name));
    const paidCount = players.filter((player) => player.paid).length;
    res.status(200).json({
      season: season.label,
      start: season.start,
      end: new Date(season.end.getTime() - 1),
      fee: SEASON_FEE_EUR,
      players,
      paidCount,
      collected: paidCount * SEASON_FEE_EUR,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /season/payments/{userId}:
 *   put:
 *     summary: Mark a player's season fee as paid or unpaid (administrators only)
 *     tags: [Season]
 *     security:
 *      - jwt: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               paid:
 *                 type: boolean
 *               season:
 *                 type: string
 *                 description: Season label (default is the current or upcoming season)
 *                 example: 2026/27
 *             required:
 *               - paid
 *     responses:
 *       '200':
 *         description: userId, season, paid and paidOn
 *       '400':
 *         description: Invalid paid or season parameter
 *       '401':
 *         description: Not authenticated
 *       '403':
 *         description: Not an administrator
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
const setPayment = async (req, res) => {
  const { userId } = req.params;
  const paid = parseBoolean(req.body.paid);
  if (paid === undefined)
    return res
      .status(400)
      .json({ message: "Body parameter 'paid' is required and must be a boolean." });
  const season = req.body.season ? parseSeason(req.body.season) : seasonFor();
  if (!season) return invalidSeason(res);
  try {
    if (!isValidId(userId) || !(await User.exists({ _id: userId })))
      return res
        .status(404)
        .json({ message: `User with id '${userId}' not found.` });
    const filter = { season: season.label, userId };
    let paidOn = null;
    if (paid) {
      // Keeps the original payment date if it was already recorded
      const payment = await SeasonPayment.findOneAndUpdate(
        filter,
        { $setOnInsert: { paidOn: new Date() } },
        { upsert: true, new: true }
      ).exec();
      paidOn = payment.paidOn;
    } else await SeasonPayment.deleteOne(filter).exec();
    res.status(200).json({ userId, season: season.label, paid, paidOn });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { seasonOverview, setPayment };
