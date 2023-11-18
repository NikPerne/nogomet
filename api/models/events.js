const mongoose = require("mongoose");

const signupSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required!"] },
  attending: {
    type: Boolean,
  },
  createdOn: { type: Date, default: Date.now },
});

const eventSchema = mongoose.Schema({
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
