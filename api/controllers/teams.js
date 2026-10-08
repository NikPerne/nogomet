const mongoose = require("mongoose");
const Event = mongoose.model("Event");
const { TEAM_KEYS } = require("../models/events");
const { isValidId } = require("./helpers");

const MAX_PLAYERS_PER_TEAM = 50;

const eventNotFound = (res, eventId) =>
  res.status(404).json({ message: `Event with id '${eventId}' not found.` });

const respondSaveError = (res, err) => {
  if (err.name === "ValidationError")
    res.status(400).json({ message: err.message });
  else res.status(500).json({ message: err.message });
};

/**
 * Validates a JSON team line-up; returns { teams } or { error }
 */
const parseTeams = (body) => {
  const teams = {};
  const userIds = new Set();
  for (const key of TEAM_KEYS) {
    const players = body?.[key];
    if (!Array.isArray(players) || players.length > MAX_PLAYERS_PER_TEAM)
      return { error: `'${key}' must be a list of at most ${MAX_PLAYERS_PER_TEAM} players.` };
    teams[key] = [];
    for (const player of players) {
      const name = typeof player?.name === "string" ? player.name.trim() : "";
      if (!name) return { error: "Every player needs a name." };
      if (player.userId !== undefined && player.userId !== null) {
        if (!isValidId(player.userId)) return { error: `Invalid userId '${player.userId}'.` };
        if (userIds.has(String(player.userId)))
          return { error: `Player '${name}' is listed more than once.` };
        userIds.add(String(player.userId));
      }
      teams[key].push({
        name,
        userId: player.userId ?? undefined,
        guest: player.guest === true ? true : undefined,
      });
    }
  }
  return { teams };
};

/**
 * Loads the event, applies the change and responds with the updated event
 */
const updateEvent = async (req, res, apply) => {
  const { eventId } = req.params;
  if (!isValidId(eventId)) return eventNotFound(res, eventId);
  try {
    const event = await Event.findById(eventId).exec();
    if (!event) return eventNotFound(res, eventId);
    if (apply(event) === false) return;
    await event.save();
    res.status(200).json(event);
  } catch (err) {
    respondSaveError(res, err);
  }
};

/**
 * @openapi
 * /events/{eventId}/teams:
 *   put:
 *     summary: Save the team line-up (administrators only)
 *     description: Everyone sees the saved teams. Send JSON. An existing score is kept.
 *     tags: [Teams]
 *     security:
 *      - jwt: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teams'
 *     responses:
 *       '200':
 *         description: The updated event
 *       '400':
 *         description: Invalid line-up
 *       '401':
 *         description: Not authenticated
 *       '403':
 *         description: Not an administrator
 *       '404':
 *         description: Event not found
 *   delete:
 *     summary: Remove the saved teams and score (administrators only)
 *     tags: [Teams]
 *     security:
 *      - jwt: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: The updated event
 *       '401':
 *         description: Not authenticated
 *       '403':
 *         description: Not an administrator
 *       '404':
 *         description: Event not found
 */
const saveTeams = (req, res) => {
  const { teams, error } = parseTeams(req.body);
  if (error) return res.status(400).json({ message: error });
  return updateEvent(req, res, (event) => {
    event.teams = teams;
  });
};

const clearTeams = (req, res) =>
  updateEvent(req, res, (event) => {
    event.teams = undefined;
    event.score = undefined;
  });

/**
 * @openapi
 * /events/{eventId}/score:
 *   put:
 *     summary: Save the final score (administrators only)
 *     description: Requires saved teams. Wins, draws and losses in /users statistics come from it.
 *     tags: [Teams]
 *     security:
 *      - jwt: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/Score'
 *     responses:
 *       '200':
 *         description: The updated event
 *       '400':
 *         description: Invalid score
 *       '401':
 *         description: Not authenticated
 *       '403':
 *         description: Not an administrator
 *       '404':
 *         description: Event not found
 *       '409':
 *         description: Teams are not saved yet
 *   delete:
 *     summary: Remove the score (administrators only)
 *     tags: [Teams]
 *     security:
 *      - jwt: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: The updated event
 *       '401':
 *         description: Not authenticated
 *       '403':
 *         description: Not an administrator
 *       '404':
 *         description: Event not found
 */
const saveScore = (req, res) => {
  const score = Object.fromEntries(
    TEAM_KEYS.map((key) => [key, req.body[key] === "" ? NaN : Number(req.body[key])])
  );
  if (Object.values(score).some((goals) => !Number.isInteger(goals)))
    return res
      .status(400)
      .json({ message: `Body parameters ${TEAM_KEYS.join(" and ")} must be whole numbers.` });
  return updateEvent(req, res, (event) => {
    if (!event.teams) {
      res.status(409).json({ message: "Save the teams before entering a score." });
      return false;
    }
    event.score = score;
  });
};

const clearScore = (req, res) =>
  updateEvent(req, res, (event) => {
    event.score = undefined;
  });

module.exports = { saveTeams, clearTeams, saveScore, clearScore };
