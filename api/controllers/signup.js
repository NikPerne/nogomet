const mongoose = require("mongoose");
const Event = mongoose.model("Event");
const { isValidId, parseBoolean, isOwnSignup } = require("./helpers");

/**
 * Users can remove their own signup and guests they added
 */
const canRemoveSignup = (signup, user) =>
  isOwnSignup(signup, user) || !!signup.guestOf?.equals(user._id);

const MAX_GUESTS_PER_USER = 3;
const GUEST_NAME_MAX_LENGTH = 40;

const eventNotFound = (res, eventId) =>
  res.status(404).json({ message: `Event with id '${eventId}' not found.` });

const signupNotFound = (res, signupId) =>
  res.status(404).json({ message: `Signup with id '${signupId}' not found.` });

/**
 * Responds with 409 and returns true when the event no longer accepts signup changes
 */
const rejectIfClosed = (res, event) => {
  const reason = event.signupsClosedReason();
  if (reason) res.status(409).json({ message: reason });
  return !!reason;
};

/**
 * Optional note; an empty string clears it (undefined means "not provided")
 */
const parseNote = (value) => (typeof value === "string" ? value.trim() : undefined);

const findEvent = (eventId) =>
  Event.findById(eventId)
    .select("name date maxPlayers cancelled signedup")
    .exec();

const respondSaveError = (res, err) => {
  if (err.name === "ValidationError")
    res.status(400).json({ message: err.message });
  else res.status(500).json({ message: err.message });
};

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
 *               note:
 *                 type: string
 *                 description: Optional short note (max 100 characters)
 *             required:
 *               - attending
 *     responses:
 *       '201':
 *         description: Successful response with the created signup
 *       '400':
 *         description: Body parameter 'attending' missing or invalid, or note too long
 *       '401':
 *         description: Not authenticated
 *       '404':
 *         description: Event not found
 *       '409':
 *         description: Already signed up, or event is past or cancelled
 *       '500':
 *         description: Internal server error
 */
const signupCreate = async (req, res) => {
  const { eventId } = req.params;
  const attending = parseBoolean(req.body.attending);
  if (attending === undefined)
    return res.status(400).json({
      message: "Body parameter 'attending' is required and must be a boolean.",
    });
  if (!isValidId(eventId)) return eventNotFound(res, eventId);
  try {
    const event = await findEvent(eventId);
    if (!event) return eventNotFound(res, eventId);
    if (rejectIfClosed(res, event)) return;
    if (event.signedup.some((signup) => isOwnSignup(signup, req.user)))
      return res
        .status(409)
        .json({ message: "You have already signed up for this event." });

    // When the event is full, attending players join the waitlist (see confirmedSignups)
    event.signedup.push({
      name: req.user.name,
      userId: req.user._id,
      attending,
      attendingSince: attending ? new Date() : undefined,
      note: parseNote(req.body.note) || undefined,
    });
    await event.save();
    res.status(201).json(event.signedup[event.signedup.length - 1]);
  } catch (err) {
    respondSaveError(res, err);
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
    if (!signup) return signupNotFound(res, signupId);
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
 *   put:
 *     summary: Change the current user's answer and/or note
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
 *         description: ID of the signup to change
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       description: At least one of attending or note; an empty note removes it
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               attending:
 *                 type: boolean
 *               note:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful response with the updated signup
 *       '400':
 *         description: Neither attending nor note given, attending invalid, or note too long
 *       '401':
 *         description: Not authenticated
 *       '403':
 *         description: Not authorized to change this signup
 *       '404':
 *         description: Event or signup not found
 *       '409':
 *         description: Event is past or cancelled
 *       '500':
 *         description: Internal server error
 */
const signupUpdateOne = async (req, res) => {
  const { eventId, signupId } = req.params;
  const attending = parseBoolean(req.body.attending);
  const note = parseNote(req.body.note);
  if (req.body.attending !== undefined && attending === undefined)
    return res
      .status(400)
      .json({ message: "Body parameter 'attending' must be a boolean." });
  if (attending === undefined && note === undefined)
    return res.status(400).json({
      message: "Body parameter 'attending' or 'note' is required.",
    });
  if (!isValidId(eventId)) return eventNotFound(res, eventId);
  try {
    const event = await findEvent(eventId);
    if (!event) return eventNotFound(res, eventId);
    const signup = isValidId(signupId) ? event.signedup.id(signupId) : null;
    if (!signup) return signupNotFound(res, signupId);
    if (!isOwnSignup(signup, req.user))
      return res
        .status(403)
        .json({ message: "Not authorized to change this signup." });
    if (rejectIfClosed(res, event)) return;

    if (attending !== undefined && !!signup.attending !== attending) {
      // Switching to attending joins the back of the queue
      signup.attending = attending;
      signup.attendingSince = attending ? new Date() : undefined;
    }
    if (note !== undefined) signup.note = note || undefined;
    signup.userId = req.user._id;
    await event.save();
    res.status(200).json(signup);
  } catch (err) {
    respondSaveError(res, err);
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
 *       '409':
 *         description: Event is past or cancelled
 *       '500':
 *         description: Internal server error
 */
const signupDeleteOne = async (req, res) => {
  const { eventId, signupId } = req.params;
  if (!isValidId(eventId)) return eventNotFound(res, eventId);
  try {
    const event = await findEvent(eventId);
    if (!event) return eventNotFound(res, eventId);
    const signup = isValidId(signupId) ? event.signedup.id(signupId) : null;
    if (!signup) return signupNotFound(res, signupId);
    if (!canRemoveSignup(signup, req.user))
      return res
        .status(403)
        .json({ message: "Not authorized to delete this signup." });
    if (rejectIfClosed(res, event)) return;

    signup.deleteOne();
    await event.save();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /events/{eventId}/guests:
 *   post:
 *     summary: Add a guest (attending) on behalf of the current user
 *     description: >
 *       Guests take a spot like any attending player (and join the waitlist when the event
 *       is full). Users can add up to 3 guests per event; administrators have no limit, so
 *       they can also add players who answered elsewhere.
 *     tags: [Signups]
 *     security:
 *      - jwt: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         description: ID of the event
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Guest's name (max 40 characters)
 *             required:
 *               - name
 *     responses:
 *       '201':
 *         description: Successful response with the created guest signup
 *       '400':
 *         description: Name missing or too long
 *       '401':
 *         description: Not authenticated
 *       '404':
 *         description: Event not found
 *       '409':
 *         description: Guest limit reached, or event is past or cancelled
 *       '500':
 *         description: Internal server error
 */
const guestCreate = async (req, res) => {
  const { eventId } = req.params;
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  if (!name || name.length > GUEST_NAME_MAX_LENGTH)
    return res.status(400).json({
      message: `Body parameter 'name' is required (max ${GUEST_NAME_MAX_LENGTH} characters).`,
    });
  if (!isValidId(eventId)) return eventNotFound(res, eventId);
  try {
    const event = await findEvent(eventId);
    if (!event) return eventNotFound(res, eventId);
    if (rejectIfClosed(res, event)) return;
    const ownGuests = event.signedup.filter((signup) =>
      signup.guestOf?.equals(req.user._id)
    ).length;
    if (!req.user.admin && ownGuests >= MAX_GUESTS_PER_USER)
      return res.status(409).json({
        message: `You can add at most ${MAX_GUESTS_PER_USER} guests per event.`,
      });

    event.signedup.push({
      name,
      guestOf: req.user._id,
      guestOfName: req.user.name,
      attending: true,
      attendingSince: new Date(),
    });
    await event.save();
    res.status(201).json(event.signedup[event.signedup.length - 1]);
  } catch (err) {
    respondSaveError(res, err);
  }
};

module.exports = {
  signupCreate,
  signupReadOne,
  signupUpdateOne,
  signupDeleteOne,
  guestCreate,
};
