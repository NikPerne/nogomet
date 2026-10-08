const mongoose = require("mongoose");
const User = mongoose.model("User");
const Event = mongoose.model("Event");
const { sendMail, appUrl, escapeHtml } = require("../config/mail");
const { sendPushToUsers } = require("../config/push");
const { isOwnSignup } = require("../controllers/helpers");
const { TIME_ZONE } = require("./time");

/**
 * Reminders go out for events starting within this many hours (default 30, so a daily run
 * at ~18:00 reminds the evening before). Each event is reminded about once.
 */
const reminderWindowMs = () =>
  (Number(process.env.REMINDER_HOURS_BEFORE) || 30) * 60 * 60 * 1000;

/**
 * Older events have no time of day; they are stored at local midnight
 */
const hasTimeOfDay = (date) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date) !== "00:00";

/**
 * e.g. "torek, 14. oktober 2026 ob 18:00" in Ljubljana time
 */
const formatWhen = (date) => {
  const day = new Intl.DateTimeFormat("sl-SI", {
    timeZone: TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  if (!hasTimeOfDay(date)) return day;
  const time = new Intl.DateTimeFormat("sl-SI", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
  return `${day} ob ${time}`;
};

const eventLink = (event) => `${appUrl()}/events/${event._id}`;

/**
 * Sends one email per user who hasn't turned email notifications off, one after another;
 * failures are logged and skipped. Returns how many emails were handed to the mail service.
 */
const sendToEach = async (users, buildMail) => {
  let sent = 0;
  for (const user of users.filter((u) => u.emailNotifications !== false)) {
    try {
      await sendMail({ to: user.email, toName: user.name, ...buildMail(user) });
      sent++;
    } catch (err) {
      console.error(`Notification email to user ${user._id} failed:`, err.message);
    }
  }
  return sent;
};

const footer = {
  text: "\n\nObvestila lahko izklopiš v aplikaciji pod »Moj profil«.",
  html: "<p style=\"color:#888;font-size:12px\">Obvestila lahko izklopiš v aplikaciji pod »Moj profil«.</p>",
};

/**
 * Tells everyone who said "Pridem" (not guests) that the event was cancelled: by email
 * (unless turned off) and by push to their subscribed devices
 */
const notifyCancellation = async (event) => {
  const attending = event.signedup.filter((signup) => signup.attending && !signup.guestOf);
  if (attending.length === 0) return 0;
  const candidates = await User.find({
    $or: [
      { _id: { $in: attending.filter((s) => s.userId).map((s) => s.userId) } },
      { name: { $in: attending.filter((s) => !s.userId).map((s) => s.name) } },
    ],
  })
    .select("name email emailNotifications")
    .exec();
  const recipients = candidates.filter((user) =>
    attending.some((signup) => isOwnSignup(signup, user))
  );
  const when = formatWhen(event.date);
  const reason = event.cancelReason ? `Razlog: ${event.cancelReason}` : "";
  const link = eventLink(event);
  const sent = await sendToEach(recipients, (user) => ({
    subject: `Odpovedano: ${event.name}, ${when}`,
    text:
      `Pozdravljen/a ${user.name},\n\n` +
      `dogodek »${event.name}« (${when}) je odpovedan.\n${reason}\n\n${link}` +
      footer.text,
    html:
      `<p>Pozdravljen/a ${escapeHtml(user.name)},</p>` +
      `<p>dogodek <b>${escapeHtml(event.name)}</b> (${escapeHtml(when)}) je <b>odpovedan</b>.</p>` +
      (reason ? `<p>${escapeHtml(reason)}</p>` : "") +
      `<p><a href="${link}">Odpri dogodek</a></p>` +
      footer.html,
  }));
  const pushed = await sendPushToUsers(
    recipients.map((user) => user._id),
    {
      title: `Odpovedano: ${event.name}`,
      body: `${when}${event.cancelReason ? ` – ${event.cancelReason}` : ""}`,
      url: `/events/${event._id}`,
    }
  );
  console.log(`Cancellation: ${sent} email(s), ${pushed} push(es) for event ${event._id}.`);
  return sent;
};

/**
 * Regulars: users who played (as confirmed players) in at least one past, non-cancelled event
 */
const findRegulars = async (now = Date.now()) => {
  const [users, pastEvents] = await Promise.all([
    User.find().select("name email emailNotifications").exec(),
    Event.find({ date: { $lt: new Date(now) }, cancelled: { $ne: true } })
      .select("date maxPlayers signedup")
      .exec(),
  ]);
  return users.filter((user) =>
    pastEvents.some((event) =>
      event.confirmedSignups().some((signup) => isOwnSignup(signup, user))
    )
  );
};

/**
 * New match announcements are off unless NOTIFY_NEW_EVENTS=true
 */
const newEventNotificationsEnabled = () => process.env.NOTIFY_NEW_EVENTS === "true";

/**
 * Announces a newly created upcoming event to regulars, by email (unless turned off) and
 * push - only when NOTIFY_NEW_EVENTS=true. Used for admin-created and auto-created matches.
 * Returns { emailsSent, pushesSent }.
 */
const notifyNewEvent = async (event) => {
  if (!newEventNotificationsEnabled() || event.cancelled || event.date <= new Date())
    return { emailsSent: 0, pushesSent: 0 };
  const recipients = await findRegulars();
  const when = formatWhen(event.date);
  const link = eventLink(event);
  const limit = event.maxPlayers ? ` Največ igralcev: ${event.maxPlayers}.` : "";
  const emailsSent = await sendToEach(recipients, (user) => ({
    subject: `Nova tekma: ${event.name}, ${when}`,
    text:
      `Pozdravljen/a ${user.name},\n\n` +
      `dodana je nova tekma »${event.name}« (${when}).${limit}\n` +
      `Sporoči, ali prideš: ${link}` +
      footer.text,
    html:
      `<p>Pozdravljen/a ${escapeHtml(user.name)},</p>` +
      `<p>dodana je nova tekma <b>${escapeHtml(event.name)}</b> (${escapeHtml(when)}).${escapeHtml(limit)}</p>` +
      `<p><a href="${link}">Pridem / Ne pridem</a></p>` +
      footer.html,
  }));
  const pushesSent = await sendPushToUsers(
    recipients.map((user) => user._id),
    { title: `Nova tekma: ${event.name}`, body: when, url: `/events/${event._id}` }
  );
  console.log(`New event: ${emailsSent} email(s), ${pushesSent} push(es) for event ${event._id}.`);
  return { emailsSent, pushesSent };
};

/**
 * For upcoming events (within the reminder window, not cancelled, not yet reminded),
 * reminds regulars - users who played at least one past game - who haven't answered:
 * by email (unless turned off) and by push. Returns { events, emailsSent, pushesSent }.
 */
const sendReminders = async () => {
  const now = Date.now();
  const events = await Event.find({
    date: { $gt: new Date(now), $lte: new Date(now + reminderWindowMs()) },
    cancelled: { $ne: true },
    remindersSentAt: { $exists: false },
  }).exec();
  if (events.length === 0) return { events: 0, emailsSent: 0, pushesSent: 0 };

  const regulars = await findRegulars(now);

  let emailsSent = 0;
  let pushesSent = 0;
  for (const event of events) {
    // Marked first, so an overlapping run can't send the same reminders twice
    await Event.updateOne({ _id: event._id }, { $set: { remindersSentAt: new Date() } }).exec();
    const recipients = regulars.filter(
      (user) => !event.signedup.some((signup) => isOwnSignup(signup, user))
    );
    const when = formatWhen(event.date);
    const link = eventLink(event);
    const players = event.confirmedSignups().length;
    const count = event.maxPlayers ? `${players}/${event.maxPlayers}` : `${players}`;
    emailsSent += await sendToEach(recipients, (user) => ({
      subject: `Prideš? ${event.name}, ${when}`,
      text:
        `Pozdravljen/a ${user.name},\n\n` +
        `za »${event.name}« (${when}) še nisi odgovoril/a. Prijavljenih: ${count}.\n` +
        `Sporoči, ali prideš: ${link}` +
        footer.text,
      html:
        `<p>Pozdravljen/a ${escapeHtml(user.name)},</p>` +
        `<p>za <b>${escapeHtml(event.name)}</b> (${escapeHtml(when)}) še nisi odgovoril/a. ` +
        `Prijavljenih: ${count}.</p>` +
        `<p><a href="${link}">Pridem / Ne pridem</a></p>` +
        footer.html,
    }));
    pushesSent += await sendPushToUsers(
      recipients.map((user) => user._id),
      {
        title: `Prideš? ${event.name}`,
        body: `${when} · prijavljenih ${count}`,
        url: `/events/${event._id}`,
      }
    );
    console.log(`Reminders: ${recipients.length} recipient(s) for event ${event._id}.`);
  }
  return { events: events.length, emailsSent, pushesSent };
};

module.exports = { notifyCancellation, notifyNewEvent, sendReminders, formatWhen };
