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
});

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
 *     signedup:
 *      type: array
 *      description: List of users signed up for the event.
 *      items:
 *       $ref: '#/components/schemas/Signup'
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
  signedup: {
    type: [signupSchema],
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

mongoose.model("Event", eventSchema, "Events");
