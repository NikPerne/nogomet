const mongoose = require("mongoose");
const Event = mongoose.model("Event");
const User = mongoose.model("User"); // Assuming you have a User model for handling user data

const getAuthor = async (req, res, cbResult) => {
  if (req.auth?.email) {
    try {
      let user = await User.findOne({ email: req.auth.email }).exec();
      if (!user) res.status(401).json({ message: "User not found." });
      else cbResult(req, res, user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

/**
 * @openapi
 * /events/{eventId}/signups:
 *   post:
 *     summary: Create a new signup for an event
 *     tags: [Signups]
 *     security:
 *      - jwt: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         description: ID of the event to sign up for
 *         schema:
 *           type: string
 *       - in: body
 *         name: body
 *         description: Signup details
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 attending:
 *                   type: boolean
 *                   description: Whether the user is attending the event or not
 *               required:
 *                 - attending
 *     responses:
 *       '201':
 *         description: Successful response with the created signup
 *       '400':
 *         description: Invalid request, missing parameters, or attending not provided
 *       '404':
 *         description: Event not found
 *       '500':
 *         description: Internal server error
 */

const signupCreate = async (req, res) => {
  getAuthor(req, res, async (req, res, author) => {
    const { eventId } = req.params;
    if (!eventId)
      res
        .status(400)
        .json({ message: "Path parameter 'locationId' is required." });
    else {
      try {
        let event = await Event.findById(eventId)
          .select("signedup")
          .exec();
        doSignup(req, res, event, author.name);
        author.timesSignedUp++;
        await author.save();
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
  });
};

const doSignup = async (req, res, event, name) => {
  if (!event)
    res.status(404).json({
      message: `Event with id '${req.params.eventId}' not found.`,
    });
  else if (!req.body.attending)
    res.status(400).json({
      message: "Body parameters 'attending' required",
    });
  else {
    event.signedup.push({
      name: name,
      attending: req.body.attending,
    });
    try {
      await event.save();
      res.status(201).json(event.signedup.slice(-1).pop());
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

/**
 * @openapi
 * /events/{eventId}/signups/{signupId}:
 *   get:
 *     summary: Get details of a specific signup for an event
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
 *         description: ID of the signup to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response with the event and signup details
 *       '400':
 *         description: Invalid request or missing parameters
 *       '404':
 *         description: Event or signup not found
 *       '500':
 *         description: Internal server error
 */

const SignUpReadOne = async (req, res) => {
  try {
    let event = await Event.findById(req.params.eventId)
      .select("name signups")
      .exec();
    if (!event)
      res.status(404).json({
        message: `Event with id '${req.params.eventId}' not found`,
      });
    else if (!event.signup || event.signup.length == 0)
      res.status(404).json({ message: "No signups found." });
    else {
      let signup = event.signup.id(req.params.signupId);
      if (!signup)
        res.status(404).json({
          message: `Signup with id '${req.params.signupId}' not found.`,
        });
      else {
        res.status(200).json({
          event: {
            _id: req.params.eventId,
            name: event.name,
          },
          signup,
        });
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /events/{eventId}/signups/{signupId}:
 *   delete:
 *     summary: Delete a signup for an event
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
 *       '400':
 *         description: Invalid request or missing parameters
 *       '403':
 *         description: Not authorized to delete this signup
 *       '404':
 *         description: Event or signup not found
 *       '500':
 *         description: Internal server error
 */

const signUpDeleteOne = async (req, res) => {
  const { eventId, signupId, userId } = req.params;
  if (!eventId || !signupId)
    res.status(400).json({
      message: "Path parameters 'eventId' and 'signupId' are required.",
    });
  else {
    try {
      let event = await Event.findById(eventId)
        .select("signedup")
        .exec();
      if (!event)
        res.status(404).json({
          message: `Event with id '${eventId}' not found.`,
        });
      else if (event.signedup && event.signedup.length > 0) {
        const signup = event.signedup.id(signupId);
        if (!signup)
          res.status(404).json({
            message: `Signup with id '${signupId}' not found.`,
          });
        else {
          getAuthor(req, res, async (req, res, author) => {
            if (signup.name != author.name) {
              res.status(403).json({
                message: "Not authorized to delete this signup.",
              });
            } else {
              signup.deleteOne();

              author.timesSignedUp--;
              await author.save();
              await event.save();
              res.status(204).send();
            }
          });
        }
      } else res.status(404).json({ message: "No signups found." });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = {
  signupCreate,
  signUpDeleteOne,
  SignUpReadOne,
};