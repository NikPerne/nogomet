const mongoose = require("mongoose");

/**
 * A browser/device that agreed to receive push notifications for a user.
 * A user can have several (phone, laptop); expired ones are removed when sending fails.
 */
const pushSubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required!"],
    index: true,
  },
  endpoint: { type: String, required: [true, "Endpoint is required!"], unique: true },
  keys: {
    p256dh: { type: String, required: [true, "Key p256dh is required!"] },
    auth: { type: String, required: [true, "Key auth is required!"] },
  },
  createdAt: { type: Date, default: Date.now },
});

mongoose.model("PushSubscription", pushSubscriptionSchema, "PushSubscriptions");
