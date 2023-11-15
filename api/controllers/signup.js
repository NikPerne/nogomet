const mongoose = require("mongoose");
const Event = mongoose.model("Event");
const User = mongoose.model("User"); // Assuming you have a User model for handling user data

const signup = async (req, res) => {
  try {
    // Get the event ID from the request parameters
    const eventId = req.params.eventId;

    // Check if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if the user is authenticated (you might have your own authentication middleware)
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Get the currently signed-in user
    const currentUser = req.user; // Assuming you store the user data in the request object

    // Check if the user is already signed up for the event
    if (event.participants.includes(currentUser._id)) {
      return res.status(400).json({ message: "User is already signed up for the event" });
    }

    // Add the user to the event's participants array
    event.participants.push(currentUser._id);

    // Save the updated event
    await event.save();

    res.status(200).json({ message: "User signed up for the event successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  signup,
};