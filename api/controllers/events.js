const mongoose = require("mongoose");
const Event = mongoose.model("Event");

const allowedCodelists = [
    "name",
    "description",
  ];

  /**
   * @openapi
   * /events:
   *   get:
   *     summary: Get a list of events
   *     parameters:
   *       - in: query
   *         name: nResults
   *         description: Number of results to return
   *         schema:
   *           type: integer
   *     responses:
   *       '200':
   *         description: Successful response with the list of events
   *       '404':
   *         description: No events found
   *       '500':
   *         description: Internal server error
   */

  const eventsList = async (req, res) => {
    let nResults = parseInt(req.query.nResults);
    nResults = isNaN(nResults) ? 10 : nResults;
    try {
      let events = await Event.aggregate([
        { $limit: nResults },
      ]);
      if (!events || events.length == 0)
        res.status(404).json({ message: "No events found." });
      else res.status(200).json(events);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }

  };

  /**
 * @openapi
 * /events/{eventId}:
 *   get:
 *     summary: Get details of a specific event
 *     parameters:
 *       - in: path
 *         name: eventId
 *         description: ID of the event to retrieve
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
  try {
    let event = await Event.findById(req.params.eventId)
      .select("-id")
      .exec();
    if (!event)
      res.status(404).json({
        message: `Event with id '${req.params.eventId}' not found`,
      });
    else res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/**
 * @openapi
 * /events/codelist/{codelist}:
 *   get:
 *     summary: Get values of a specific codelist
 *     parameters:
 *       - in: path
 *         name: codelist
 *         description: Name of the codelist to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response with the codelist values
 *       '400':
 *         description: Invalid codelist parameter
 *       '404':
 *         description: Codelist not found
 *       '500':
 *         description: Internal server error
 */

const eventsCodelist = async (req, res) => {
    let codelist = req.params.codelist;
    if (!allowedCodelists.includes(codelist))
      res.status(400).json({
        message: `Parameter 'codelist' must be one of: ${allowedCodelists.join(
          ", "
        )}`,
      });
    else {
      try {
        let codeListValues = await Event.distinct(codelist).exec();
        if (!codeListValues || codeListValues.length === 0)
          res
            .status(404)
            .json({ message: `No codelist found for '${codelist}.'` });
        else res.status(200).json(codeListValues);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
  };

  /**
 * @openapi
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Authentication]
 *     requestBody:
 *       description: Event details to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       '201':
 *         description: Successful response with the created event
 *       '500':
 *         description: Internal server error
 */

  const createEvent = async (req, res) => {

    const { name, description, date } = req.body;
  
    try {
  
      const newEvent = new Event({
        name,
        description,
        date,
        signup: [],
      });
  
      await newEvent.save();
  
      res.status(201).json(newEvent);
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' }); 
    }
  
  }

module.exports = {
    eventsList,
    eventsCodelist,
    eventsReadOne,
    createEvent,
  };