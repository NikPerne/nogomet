const mongoose = require("mongoose");
const Event = mongoose.model("Event");
const { parseLimit, isValidId } = require("./helpers");

const EDITABLE_FIELDS = ["name", "description", "date", "maxPlayers"];

/**
 * Picks editable fields from the body; an empty maxPlayers removes the limit
 */
const pickEditableFields = (body) => {
  const fields = Object.fromEntries(
    EDITABLE_FIELDS.filter((field) => body[field] !== undefined).map(
      (field) => [field, body[field]]
    )
  );
  if (fields.maxPlayers === "") fields.maxPlayers = null;
  return fields;
};

const eventNotFound = (res, eventId) =>
  res.status(404).json({ message: `Event with id '${eventId}' not found.` });

/**
 * @openapi
 * /events:
 *   get:
 *     summary: Get a list of events, newest first
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: nResults
 *         description: Number of results to return (1-1000, default 10)
 *         example: 5
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successful response with the list of events (may be empty)
 *       '500':
 *         description: Internal server error
 */
const eventsList = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ date: -1 })
      .limit(parseLimit(req.query.nResults))
      .exec();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /events/{eventId}:
 *   get:
 *     summary: Get details of a specific event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         description: ID of the event to retrieve
 *         example: 655b4c518bfcc3e808a86762
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response with the event details
 *       '404':
 *         description: Event not found
 *       '500':
 *         description: Internal server error
 */
const eventsReadOne = async (req, res) => {
  const { eventId } = req.params;
  if (!isValidId(eventId)) return eventNotFound(res, eventId);
  try {
    const event = await Event.findById(eventId).exec();
    if (!event) eventNotFound(res, eventId);
    else res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /events:
 *   post:
 *     summary: Create a new event (administrators only)
 *     tags: [Events]
 *     security:
 *      - jwt: []
 *     requestBody:
 *       description: Event details to create
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       '201':
 *         description: Successful response with the created event
 *       '400':
 *         description: Invalid or missing event fields
 *       '401':
 *         description: Not authenticated
 *       '403':
 *         description: Not an administrator
 *       '500':
 *         description: Internal server error
 */
const createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...pickEditableFields(req.body),
      signedup: [],
    });
    res.status(201).json(event);
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError")
      res.status(400).json({ message: err.message });
    else res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /events/{eventId}:
 *   put:
 *     summary: Update an event's name, description, date or maxPlayers (administrators only)
 *     tags: [Events]
 *     security:
 *      - jwt: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         description: ID of the event to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       '200':
 *         description: Successful response with the updated event
 *       '400':
 *         description: Invalid event fields
 *       '401':
 *         description: Not authenticated
 *       '403':
 *         description: Not an administrator
 *       '404':
 *         description: Event not found
 *       '500':
 *         description: Internal server error
 */
const updateEvent = async (req, res) => {
  const { eventId } = req.params;
  if (!isValidId(eventId)) return eventNotFound(res, eventId);
  try {
    const event = await Event.findByIdAndUpdate(
      eventId,
      pickEditableFields(req.body),
      { new: true, runValidators: true }
    ).exec();
    if (!event) eventNotFound(res, eventId);
    else res.status(200).json(event);
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError")
      res.status(400).json({ message: err.message });
    else res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /events/{eventId}:
 *   delete:
 *     summary: Delete an event (administrators only)
 *     description: Its signups no longer count towards players' gamesPlayed.
 *     tags: [Events]
 *     security:
 *      - jwt: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         description: ID of the event to delete
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Event deleted
 *       '401':
 *         description: Not authenticated
 *       '403':
 *         description: Not an administrator
 *       '404':
 *         description: Event not found
 *       '500':
 *         description: Internal server error
 */
const deleteEvent = async (req, res) => {
  const { eventId } = req.params;
  if (!isValidId(eventId)) return eventNotFound(res, eventId);
  try {
    const event = await Event.findByIdAndDelete(eventId).exec();
    if (!event) return eventNotFound(res, eventId);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  eventsList,
  eventsReadOne,
  createEvent,
  updateEvent,
  deleteEvent,
};
