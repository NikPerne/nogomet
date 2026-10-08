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
 * opens `url`. Expired subscriptions (404/410) are deleted.
 * Returns { subscriptions, delivered, errors } (errors as readable messages).
 */
const sendPushDetailed = async (userIds, { title, body, url }) => {
  const result = { subscriptions: 0, delivered: 0, errors: [] };
  if (!isPushConfigured() || userIds.length === 0) return result;
  const PushSubscription = mongoose.model("PushSubscription");
  const subscriptions = await PushSubscription.find({ userId: { $in: userIds } }).exec();
  result.subscriptions = subscriptions.length;
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
  for (const subscription of subscriptions) {
    try {
      await webpush.sendNotification(
        { endpoint: subscription.endpoint, keys: subscription.keys },
        payload,
        { vapidDetails: { subject, publicKey, privateKey }, TTL: 24 * 60 * 60 }
      );
      result.delivered++;
    } catch (err) {
      const service = new URL(subscription.endpoint).host;
      if (err.statusCode === 404 || err.statusCode === 410) {
        await PushSubscription.deleteOne({ _id: subscription._id }).exec();
        result.errors.push(`${service}: subscription expired and was removed (switch it on again)`);
      } else {
        const detail = `${err.statusCode ?? ""} ${err.body || err.message}`.trim();
        result.errors.push(`${service}: ${detail}`);
        console.error(`Push to subscription ${subscription._id} failed:`, detail);
      }
    }
  }
  return result;
};

/**
 * Like sendPushDetailed, returning only how many notifications were delivered
 */
const sendPushToUsers = async (userIds, payload) =>
  (await sendPushDetailed(userIds, payload)).delivered;

module.exports = { isPushConfigured, sendPushToUsers, sendPushDetailed, vapid };
