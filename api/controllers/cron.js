const crypto = require("crypto");
const { sendReminders } = require("../services/notifications");

/**
 * True when the request carries "Authorization: Bearer <CRON_SECRET>" (constant-time compare)
 */
const hasCronSecret = (req) => {
  const secret = process.env.CRON_SECRET;
  const given = /^Bearer (.+)$/.exec(req.get("authorization") ?? "")?.[1] ?? "";
  if (!secret || given.length !== secret.length) return false;
  return crypto.timingSafeEqual(Buffer.from(given), Buffer.from(secret));
};

/**
 * @openapi
 * /cron/reminders:
 *   post:
 *     summary: Send "haven't answered yet" reminder emails (for a scheduler)
 *     description: >
 *       Meant to be called once a day by an external scheduler (e.g. cron-job.org) with the
 *       header "Authorization: Bearer <CRON_SECRET>". For events starting within
 *       REMINDER_HOURS_BEFORE hours (default 30), emails regulars who haven't answered.
 *       Each event is reminded about only once, so extra calls are harmless.
 *     tags: [Events]
 *     responses:
 *       '200':
 *         description: Number of events handled and emails sent
 *       '401':
 *         description: Missing or wrong secret
 *       '503':
 *         description: CRON_SECRET is not configured
 *       '500':
 *         description: Internal server error
 */
const runReminders = async (req, res) => {
  if (!process.env.CRON_SECRET)
    return res.status(503).json({ message: "Reminders are not configured (CRON_SECRET)." });
  if (!hasCronSecret(req)) return res.status(401).json({ message: "Invalid cron secret." });
  try {
    res.status(200).json(await sendReminders());
  } catch (err) {
    console.error("Reminders failed:", err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { runReminders };
