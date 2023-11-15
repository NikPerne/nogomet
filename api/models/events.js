const mongoose = require("mongoose");

const signupSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required!"] },
  comming: {
    type: Boolean,
  },
  createdOn: { type: Date, default: Date.now },
});

const eventSchema = mongoose.Schema({
  id: {
    type: Number,
    required: [true, "Unique identifier is required!"],
  },
  name: { type: String, required: [true, "Name is required!"] },
  description: {
    type: String,
    required: [true, "Description is required!"],
  },
  signedup: {
    type: [signupSchema],
  },
});

mongoose.model("Event", eventSchema, "Events");
