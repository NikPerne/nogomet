const mongoose = require("mongoose");
const webpush = require("web-push");

/**
 * Web Push (VAPID). Configure VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY (generate them once with
 * `npx web-push generate-vapid-keys`) and VAPID_SUBJECT (e.g. mailto:you@example.com).
 * Without them, push is disabled and only email notifications are sent.
 */
const vapid = () => ({
  publicKey: process.env.VAPID_PUBLIC_KEY?.trim(),
  privateKey: process.env.VAPID_PRIVATE_KEY?.trim(),
  subject: process.env.VAPID_SUBJECT?.trim() || "mailto:admin@example.com",
});

const isPushConfigured = () => {
  const { publicKey, privateKey } = vapid();
  return !!(publicKey && privateKey);
};

/**
 * Sends a notification to every subscription of the given users. Payloads use the format
 * the Angular service worker understands ({ notification: { title, body, data } }); clicking
 * opens `url`. Expired subscriptions (404/410) are deleted. Returns how many were delivered.
 */
const sendPushToUsers = async (userIds, { title, body, url }) => {
  if (!isPushConfigured() || userIds.length === 0) return 0;
  const PushSubscription = mongoose.model("PushSubscription");
  const subscriptions = await PushSubscription.find({ userId: { $in: userIds } }).exec();
  const { publicKey, privateKey, subject } = vapid();
  const payload = JSON.stringify({
    notification: {
      title,
      body,
      icon: "assets/icons/icon-192x192.png",
      data: {
        onActionClick: { default: { operation: "navigateLastFocusedOrOpen", url } },
      },
    },
  });
  let delivered = 0;
  for (const subscription of subscriptions) {
    try {
      await webpush.sendNotification(
        { endpoint: subscription.endpoint, keys: subscription.keys },
        payload,
        { vapidDetails: { subject, publicKey, privateKey }, TTL: 24 * 60 * 60 }
      );
      delivered++;
    } catch (err) {
      if (err.statusCode === 404 || err.statusCode === 410)
        await PushSubscription.deleteOne({ _id: subscription._id }).exec();
      else console.error(`Push to subscription ${subscription._id} failed:`, err.message);
    }
  }
  return delivered;
};

module.exports = { isPushConfigured, sendPushToUsers, vapid };
