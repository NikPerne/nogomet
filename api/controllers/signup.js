const mongoose = require("mongoose");
const Event = mongoose.model("Event");
const User = mongoose.model("User");
const { isValidId } = require("./helpers");

/**
 * Form bodies send booleans as strings, so accept both representations
 */
const parseAttending = (value) => {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return undefined;
};

/**
 * Signups created before userId was stored can only be matched by name
 */
const isOwnSignup = (signup, user) =>
  signup.userId ? signup.userId.equals(user._id) : signup.name === user.name;

/**
 * timesSignedUp counts only signups where the user is attending ("Pridem")
 */
const changeTimesSignedUp = (userId, delta) =>
  User.updateOne(
    delta < 0 ? { _id: userId, timesSignedUp: { $gt: 0 } } : { _id: userId },
    { $inc: { timesSignedUp: delta } }
  ).exec();

const eventNotFound = (res, eventId) =>
  res.status(404).json({ message: `Event with id '${eventId}' not found.` });

/**
 * @openapi
 * /events/{eventId}/signups:
 *   post:
 *     summary: Sign the current user up for an event
 *     tags: [Signups]
 *     security:
 *      - jwt: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         description: ID of the event to sign up for
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               attending:
 *                 type: boolean
 *                 description: Whether the user is attending the event or not
 *             required:
 *               - attending
 *     responses:
 *       '201':
 *         description: Successful response with the created signup
 *       '400':
 *         description: Body parameter 'attending' missing or invalid
 *       '401':
 *         description: Not authenticated
 *       '404':
 *         description: Event not found
 *       '409':
 *         description: User has already signed up for this event
 *       '500':
 *         description: Internal server error
 */
const signupCreate = async (req, res) => {
  const { eventId } = req.params;
  const attending = parseAttending(req.body.attending);
  if (attending === undefined)
    return res.status(400).json({
      message: "Body parameter 'attending' is required and must be a boolean.",
    });
  if (!isValidId(eventId)) return eventNotFound(res, eventId);
  try {
    const event = await Event.findById(eventId).select("signedup").exec();
    if (!event) return eventNotFound(res, eventId);
    if (event.signedup.some((signup) => isOwnSignup(signup, req.user)))
      return res
        .status(409)
        .json({ message: "You have already signed up for this event." });

    event.signedup.push({
      name: req.user.name,
      userId: req.user._id,
      attending,
    });
    await event.save();
    if (attending) await changeTimesSignedUp(req.user._id, 1);
    res.status(201).json(event.signedup[event.signedup.length - 1]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /events/{eventId}/signups/{signupId}:
 *   get:
 *     summary: Get details of a specific signup for an event
 *     tags: [Signups]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         description: ID of the event containing the signup
 *         schema:
 *           type: string
 *       - in: path
 *         name: signupId
 *         description: ID of the signup to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response with the event and signup details
 *       '404':
 *         description: Event or signup not found
 *       '500':
 *         description: Internal server error
 */
const signupReadOne = async (req, res) => {
  const { eventId, signupId } = req.params;
  if (!isValidId(eventId)) return eventNotFound(res, eventId);
  try {
    const event = await Event.findById(eventId).select("name signedup").exec();
    if (!event) return eventNotFound(res, eventId);
    const signup = isValidId(signupId) ? event.signedup.id(signupId) : null;
    if (!signup)
      return res
        .status(404)
        .json({ message: `Signup with id '${signupId}' not found.` });
    res.status(200).json({
      event: { _id: event._id, name: event.name },
      signup,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /events/{eventId}/signups/{signupId}:
 *   delete:
 *     summary: Delete one of the current user's signups
 *     tags: [Signups]
 *     security:
 *      - jwt: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         description: ID of the event containing the signup
 *         schema:
 *           type: string
 *       - in: path
 *         name: signupId
 *         description: ID of the signup to delete
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Successful response, no content
 *       '401':
 *         description: Not authenticated
 *       '403':
 *         description: Not authorized to delete this signup
 *       '404':
 *         description: Event or signup not found
 *       '500':
 *         description: Internal server error
 */
const signupDeleteOne = async (req, res) => {
  const { eventId, signupId } = req.params;
  if (!isValidId(eventId)) return eventNotFound(res, eventId);
  try {
    const event = await Event.findById(eventId).select("signedup").exec();
    if (!event) return eventNotFound(res, eventId);
    const signup = isValidId(signupId) ? event.signedup.id(signupId) : null;
    if (!signup)
      return res
        .status(404)
        .json({ message: `Signup with id '${signupId}' not found.` });
    if (!isOwnSignup(signup, req.user))
      return res
        .status(403)
        .json({ message: "Not authorized to delete this signup." });

    const wasAttending = signup.attending;
    signup.deleteOne();
    await event.save();
    if (wasAttending) await changeTimesSignedUp(req.user._id, -1);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  signupCreate,
  signupReadOne,
  signupDeleteOne,
};
