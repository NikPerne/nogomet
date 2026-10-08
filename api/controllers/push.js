const mongoose = require("mongoose");
const PushSubscription = mongoose.model("PushSubscription");
const { isPushConfigured, vapid } = require("../config/push");

/**
 * @openapi
 * /push/public-key:
 *   get:
 *     summary: VAPID public key for subscribing to push notifications
 *     tags: [Authentication]
 *     responses:
 *       '200':
 *         description: "{ publicKey }"
 *       '503':
 *         description: Push notifications are not configured on the server
 */
const publicKey = (req, res) => {
  if (!isPushConfigured())
    return res.status(503).json({ message: "Push notifications are not configured." });
  res.status(200).json({ publicKey: vapid().publicKey });
};

/**
 * @openapi
 * /push/subscriptions:
 *   post:
 *     summary: Register this device for the current user's push notifications
 *     description: Send the browser's PushSubscription as JSON. Re-registering a device moves it to the current user.
 *     tags: [Authentication]
 *     security:
 *      - jwt: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               endpoint:
 *                 type: string
 *               keys:
 *                 type: object
 *                 properties:
 *                   p256dh:
 *                     type: string
 *                   auth:
 *                     type: string
 *     responses:
 *       '201':
 *         description: Subscribed
 *       '400':
 *         description: Invalid subscription
 *       '401':
 *         description: Not authenticated
 *   delete:
 *     summary: Unregister a device from push notifications
 *     tags: [Authentication]
 *     security:
 *      - jwt: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               endpoint:
 *                 type: string
 *     responses:
 *       '204':
 *         description: Unsubscribed (or was not subscribed)
 *       '401':
 *         description: Not authenticated
 */
const subscribe = async (req, res) => {
  const { endpoint, keys } = req.body ?? {};
  const valid =
    typeof endpoint === "string" &&
    /^https:\/\//.test(endpoint) &&
    typeof keys?.p256dh === "string" &&
    typeof keys?.auth === "string";
  if (!valid) return res.status(400).json({ message: "Invalid push subscription." });
  try {
    await PushSubscription.findOneAndUpdate(
      { endpoint },
      { userId: req.user._id, endpoint, keys: { p256dh: keys.p256dh, auth: keys.auth } },
      { upsert: true, runValidators: true }
    ).exec();
    res.status(201).json({ subscribed: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const unsubscribe = async (req, res) => {
  const endpoint = req.body?.endpoint;
  try {
    if (typeof endpoint === "string")
      await PushSubscription.deleteOne({ endpoint, userId: req.user._id }).exec();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { publicKey, subscribe, unsubscribe };
