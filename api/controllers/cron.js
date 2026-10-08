const crypto = require("crypto");
const { sendReminders } = require("../services/notifications");
const { createNextWeeklyEvent } = require("../services/schedule");

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
 * /cron/daily:
 *   post:
 *     summary: Daily jobs for a scheduler - next weekly event and reminders
 *     description: >
 *       Meant to be called once a day by an external scheduler (e.g. cron-job.org) with the
 *       header "Authorization: Bearer <CRON_SECRET>". /cron/reminders does the same.
 *       1) When no upcoming event exists, creates next week's match as a copy of the latest
 *       event (unless AUTO_WEEKLY_EVENTS=false). 2) For events starting within
 *       REMINDER_HOURS_BEFORE hours (default 30), reminds regulars who haven't answered, by
 *       email and push. Each event is reminded about only once, so extra calls are harmless.
 *     tags: [Events]
 *     responses:
 *       '200':
 *         description: createdEventId (or null), events reminded, emailsSent and pushesSent
 *       '401':
 *         description: Missing or wrong secret
 *       '503':
 *         description: CRON_SECRET is not configured
 *       '500':
 *         description: Internal server error
 */
const runDaily = async (req, res) => {
  if (!process.env.CRON_SECRET)
    return res.status(503).json({ message: "Scheduled jobs are not configured (CRON_SECRET)." });
  if (!hasCronSecret(req)) return res.status(401).json({ message: "Invalid cron secret." });
  try {
    const created = await createNextWeeklyEvent();
    const reminders = await sendReminders();
    res.status(200).json({ createdEventId: created?._id ?? null, ...reminders });
  } catch (err) {
    console.error("Daily jobs failed:", err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { runDaily };
