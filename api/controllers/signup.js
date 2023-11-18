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