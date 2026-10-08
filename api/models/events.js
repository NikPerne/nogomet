const mongoose = require("mongoose");


/**
 * @openapi
 * components:
 *  schemas:
 *   Signup:
 *    type: object
 *    description: User signup for an event.
 *    properties:
 *     name:
 *      type: string
 *      description: Name of the user signing up.
 *      example: Nik Perne
 *     userId:
 *      type: string
 *      description: ID of the user who created the signup (missing on legacy signups).
 *     attending:
 *      type: boolean
 *      description: Indicates whether the user is attending the event.
 *      example: true
 *     createdOn:
 *      type: string
 *      description: Date of signup creation.
 *      format: date-time
 *      example: 2023-01-01T12:00:00.000Z
 *     attendingSince:
 *      type: string
 *      description: When the user last answered "attending"; decides waitlist order.
 *      format: date-time
 *     note:
 *      type: string
 *      description: Optional short note from the player (max 100 characters).
 *      example: Pridem 10 min kasneje
 *     guestOf:
 *      type: string
 *      description: For guests, ID of the user who added them (guests have no userId).
 *     guestOfName:
 *      type: string
 *      description: For guests, name of the user who added them.
 *    required:
 *     - name
 *     - attending
 *     - createdOn
 */

const signupSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required!"] },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  attending: { type: Boolean },
  createdOn: { type: Date, default: Date.now },
  attendingSince: { type: Date },
  note: {
    type: String,
    trim: true,
    maxlength: [100, "Note can be at most 100 characters!"],
  },
  guestOf: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  guestOfName: { type: String },
});

/**
 * Team keys and their order; used in teams, score and statistics
 */
const TEAM_KEYS = ["rumeni", "rdeci"];

/**
 * @openapi
 * components:
 *  schemas:
 *   TeamPlayer:
 *    type: object
 *    properties:
 *     name:
 *      type: string
 *      example: Nik Perne
 *     userId:
 *      type: string
 *      description: Missing for guests and legacy signups.
 *     guest:
 *      type: boolean
 *      description: True for guests (never matched to a user by name).
 *    required:
 *     - name
 *   Teams:
 *    type: object
 *    description: Saved team line-up (Rumeni = yellow, Rdeči = red).
 *    properties:
 *     rumeni:
 *      type: array
 *      items:
 *       $ref: '#/components/schemas/TeamPlayer'
 *     rdeci:
 *      type: array
 *      items:
 *       $ref: '#/components/schemas/TeamPlayer'
 *   Score:
 *    type: object
 *    description: Final score; only possible when teams are saved.
 *    properties:
 *     rumeni:
 *      type: integer
 *      example: 7
 *     rdeci:
 *      type: integer
 *      example: 5
 */
const teamPlayerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Player name is required!"],
      maxlength: [60, "Player name can be at most 60 characters!"],
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    guest: { type: Boolean },
  },
  { _id: false }
);

const teamsSchema = new mongoose.Schema(
  Object.fromEntries(TEAM_KEYS.map((key) => [key, [teamPlayerSchema]])),
  { _id: false }
);

const goals = {
  type: Number,
  required: [true, "Both scores are required!"],
  min: [0, "Score can't be negative!"],
  max: [99, "Score can be at most 99!"],
  validate: { validator: Number.isInteger, message: "Score must be a whole number!" },
};
const scoreSchema = new mongoose.Schema(
  Object.fromEntries(TEAM_KEYS.map((key) => [key, goals])),
  { _id: false }
);

/**
 * Identifies a player across signups, teams and votes: the userId, or for players
 * without one "guest:<name>" / "name:<name>" (legacy). The frontend uses the same keys.
 */
const playerKeyOf = (player) =>
  player.userId
    ? player.userId.toString()
    : `${player.guest || player.guestOf ? "guest" : "name"}:${player.name}`;

/**
 * Player of the match vote. Votes are secret: the event's JSON only contains the tally.
 */
const mvpVoteSchema = new mongoose.Schema(
  {
    voterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    playerKey: { type: String, required: true },
    playerName: { type: String, required: true },
  },
  { _id: false }
);

/** Voting opens at kick-off and stays open for a week */
const MVP_VOTING_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * @openapi
 * components:
 *  schemas:
 *   Event:
 *    type: object
 *    description: Event information.
 *    properties:
 *     name:
 *      type: string
 *      description: Name of the event.
 *      example: Nogomet
 *     description:
 *      type: string
 *      description: Description of the event.
 *      example: Torkova rekreacija.
 *     date:
 *      type: string
 *      description: Date of the event.
 *      format: date-time
 *      example: 2023-01-15T18:00:00.000Z
 *     maxPlayers:
 *      type: integer
 *      description: Maximum number of attending players (no limit if missing).
 *      example: 12
 *     cancelled:
 *      type: boolean
 *      description: Cancelled events lock signups and don't count in statistics.
 *     cancelReason:
 *      type: string
 *      description: Optional reason shown to players when the event is cancelled.
 *      example: Igrišče je zaprto zaradi dežja
 *     signedup:
 *      type: array
 *      description: List of users signed up for the event.
 *      items:
 *       $ref: '#/components/schemas/Signup'
 *     teams:
 *      $ref: '#/components/schemas/Teams'
 *     score:
 *      $ref: '#/components/schemas/Score'
 *    required:
 *     - name
 *     - description
 *     - date
 *     - signedup
 */

const eventSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required!"] },
  description: {
    type: String,
    required: [true, "Description is required!"],
  },
  date: { type: Date, default: Date.now },
  maxPlayers: { type: Number, min: [1, "At least one player is required!"] },
  cancelled: { type: Boolean, default: false },
  cancelReason: {
    type: String,
    trim: true,
    maxlength: [200, "Cancel reason can be at most 200 characters!"],
  },
  signedup: {
    type: [signupSchema],
  },
  teams: { type: teamsSchema },
  score: { type: scoreSchema },
  // Set when the "haven't answered yet" reminder emails were sent, so they go out once
  remindersSentAt: { type: Date },
  mvpVotes: { type: [mvpVoteSchema], default: undefined },
});

/**
 * JSON for API responses: secret votes are replaced by a tally (most votes first)
 */
eventSchema.set("toJSON", {
  transform: (doc, json) => {
    if (json.mvpVotes) {
      json.mvpTally = doc.mvpTally();
      delete json.mvpVotes;
    }
    delete json.remindersSentAt;
    return json;
  },
});

/**
 * Signups stay open for 24 h after the start, since older events have no time of day
 */
const SIGNUP_GRACE_MS = 24 * 60 * 60 * 1000;

eventSchema.methods.isPast = function () {
  return !!this.date && this.date.getTime() + SIGNUP_GRACE_MS < Date.now();
};

/**
 * Why signups can't be changed (past or cancelled event), or null when they can
 */
eventSchema.methods.signupsClosedReason = function () {
  if (this.cancelled) return "This event has been cancelled.";
  if (this.isPast())
    return "Signups for this event are closed, it has already taken place.";
  return null;
};

/**
 * Attending signups in the order they said "Pridem" (legacy signups use createdOn)
 */
eventSchema.methods.attendingInOrder = function () {
  const since = (signup) =>
    new Date(signup.attendingSince ?? signup.createdOn ?? 0).getTime();
  return this.signedup
    .filter((signup) => signup.attending)
    .sort((a, b) => since(a) - since(b));
};

/**
 * The first maxPlayers attending signups play; the rest are on the waitlist
 */
eventSchema.methods.confirmedSignups = function () {
  const attending = this.attendingInOrder();
  return this.maxPlayers ? attending.slice(0, this.maxPlayers) : attending;
};

eventSchema.methods.waitlistedSignups = function () {
  return this.maxPlayers ? this.attendingInOrder().slice(this.maxPlayers) : [];
};

eventSchema.methods.isFull = function () {
  return !!this.maxPlayers && this.attendingInOrder().length >= this.maxPlayers;
};

/**
 * The user's team key ("rumeni"/"rdeci") in the saved teams, or undefined.
 * Players without userId (legacy) match by name; guests never match a user.
 */
eventSchema.methods.teamOf = function (user) {
  return TEAM_KEYS.find((key) =>
    (this.teams?.[key] ?? []).some((player) =>
      player.userId
        ? player.userId.equals(user._id)
        : !player.guest && player.name === user.name
    )
  );
};

/**
 * "win", "draw" or "loss" for the user, or undefined without a score or team
 */
eventSchema.methods.resultFor = function (user) {
  const team = this.teamOf(user);
  if (!team || !this.score) return undefined;
  const other = TEAM_KEYS.find((key) => key !== team);
  const diff = this.score[team] - this.score[other];
  return diff > 0 ? "win" : diff < 0 ? "loss" : "draw";
};

eventSchema.methods.isMvpVotingOpen = function () {
  const start = this.date?.getTime() ?? Infinity;
  return !this.cancelled && Date.now() >= start && Date.now() < start + MVP_VOTING_MS;
};

/**
 * [{ key, name, votes }], most votes first
 */
eventSchema.methods.mvpTally = function () {
  const tally = new Map();
  for (const vote of this.mvpVotes ?? []) {
    const entry = tally.get(vote.playerKey) ?? { key: vote.playerKey, name: vote.playerName, votes: 0 };
    entry.votes++;
    tally.set(vote.playerKey, entry);
  }
  return [...tally.values()].sort((a, b) => b.votes - a.votes || a.name.localeCompare(b.name));
};

/**
 * Keys of the player(s) with the most votes (ties all win), or [] without votes
 */
eventSchema.methods.mvpWinnerKeys = function () {
  const tally = this.mvpTally();
  const top = tally[0]?.votes ?? 0;
  return top > 0 ? tally.filter((entry) => entry.votes === top).map((entry) => entry.key) : [];
};

mongoose.model("Event", eventSchema, "Events");

module.exports = { TEAM_KEYS, playerKeyOf };
