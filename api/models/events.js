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
  signedup: {
    type: [signupSchema],
  },
});

mongoose.model("Event", eventSchema, "Events");
