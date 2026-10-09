/**
 * Test harness: the real Express app (app.js) against a temporary in-memory MongoDB.
 * Nothing touches the real database, and emails are captured instead of sent.
 */
const { before, after, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");

// A clean, predictable configuration for every test file (each runs in its own process)
for (const key of [
  "NODE_ENV",
  "MONGODB_URI",
  "BREVO_API_KEY",
  "MAIL_FROM",
  "APP_URL",
  "REGISTRATION_CODE",
  "CRON_SECRET",
  "NOTIFY_NEW_EVENTS",
  "NOTIFY_TEST_EMAIL",
  "AUTO_WEEKLY_EVENTS",
  "AUTO_EVENT_DAYS_BEFORE",
  "AUTO_EVENT_MAX_PLAYERS",
  "VAPID_PUBLIC_KEY",
  "VAPID_PRIVATE_KEY",
  "SEASON_FEE_EUR",
])
  delete process.env[key];
process.env.JWT_SECRET = "test-secret";

/** MongoDB version supported by the app's driver (mongoose 7 / driver 5.x) */
const MONGODB_VERSION = "7.0.14";

const DAY = 24 * 60 * 60 * 1000;

let mongod;
/** The app, available after the `before` hook */
const ctx = { app: null };

/**
 * Registers before/after hooks: start the database and app once per file,
 * empty all collections before each test, and keep printed emails quiet
 */
const setupApi = () => {
  const originalLog = console.log;
  before(async () => {
    // The mail module prints emails it can't send; tests read them from its outbox instead
    console.log = (...args) => {
      const first = String(args[0]);
      if (first.startsWith("[mail]") || /^(Cancellation|Reminders|New event|Weekly event|Password reset)/.test(first))
        return;
      originalLog(...args);
    };
    mongod = await MongoMemoryServer.create({ binary: { version: MONGODB_VERSION } });
    await mongoose.connect(mongod.getUri());
    ctx.app = require("../../app");
  });
  beforeEach(async () => {
    await Promise.all(
      Object.values(mongoose.connection.collections).map((collection) => collection.deleteMany({}))
    );
    outbox().length = 0;
  });
  after(async () => {
    console.log = originalLog;
    await mongoose.disconnect();
    await mongod?.stop();
  });
  return ctx;
};

const api = () => request(ctx.app);

const auth = (user) => ({ Authorization: `Bearer ${user.token}` });

const jwtPayload = (token) =>
  JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));

let userCounter = 0;

/**
 * Registers a user through the API; admins are promoted in the database (as you'd do once
 * in Atlas). Returns { _id, name, email, password, token }.
 */
const createUser = async ({ name, email, password = "geslo123", admin = false } = {}) => {
  userCounter++;
  name ??= `Igralec ${userCounter}`;
  email ??= `igralec${userCounter}@test.si`;
  const res = await api().post("/api/register").type("form").send({ name, email, password });
  if (res.status !== 200) throw new Error(`Register failed: ${res.status} ${JSON.stringify(res.body)}`);
  const { _id } = jwtPayload(res.body.token);
  if (admin) await mongoose.model("User").updateOne({ _id }, { admin: true });
  return { _id, name, email, password, token: res.body.token };
};

const createAdmin = (fields = {}) => createUser({ name: "Admin", ...fields, admin: true });

/**
 * Creates an event as the given admin; `inDays` sets the date relative to now
 */
const createEvent = async (admin, { inDays = 3, name = "Nogomet", ...fields } = {}) => {
  const res = await api()
    .post("/api/events")
    .set(auth(admin))
    .type("form")
    .send({ name, description: "Torkova rekreacija", date: new Date(Date.now() + inDays * DAY).toISOString(), ...fields });
  if (res.status !== 201) throw new Error(`Create event failed: ${res.status} ${JSON.stringify(res.body)}`);
  return res.body;
};

/**
 * Moves an event to another date (admin), e.g. into the past after people signed up
 */
const moveEvent = (admin, eventId, inDays) =>
  api()
    .put(`/api/events/${eventId}`)
    .set(auth(admin))
    .type("form")
    .send({ date: new Date(Date.now() + inDays * DAY).toISOString() });

const signUp = (user, eventId, attending = true, extra = {}) =>
  api()
    .post(`/api/events/${eventId}/signups`)
    .set(auth(user))
    .type("form")
    .send({ attending: String(attending), ...extra });

/** Emails captured by the mail module instead of being sent */
const outbox = () => require("../../api/config/mail").outbox;

/**
 * Waits until `check()` returns something truthy (for work done after the response is sent)
 */
const waitFor = async (check, timeoutMs = 3000) => {
  const start = Date.now();
  for (;;) {
    const value = await check();
    if (value) return value;
    if (Date.now() - start > timeoutMs) throw new Error("waitFor: timed out");
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
};

module.exports = {
  DAY,
  setupApi,
  api,
  auth,
  jwtPayload,
  createUser,
  createAdmin,
  createEvent,
  moveEvent,
  signUp,
  outbox,
  waitFor,
};
