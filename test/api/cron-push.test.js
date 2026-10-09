const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const webpush = require("web-push");
const {
  setupApi,
  api,
  auth,
  createUser,
  createAdmin,
  createEvent,
  moveEvent,
  signUp,
  outbox,
  DAY,
} = require("./helpers");

setupApi();

const SECRET = "test-cron-secret-123456";
const runDaily = (secret = SECRET) =>
  api().post("/api/cron/daily").set("Authorization", `Bearer ${secret}`);

/**
 * Sets environment variables for one test and restores them afterwards
 */
const withEnv = (t, values) => {
  for (const [key, value] of Object.entries(values)) process.env[key] = value;
  t.after(() => {
    for (const key of Object.keys(values)) delete process.env[key];
  });
};

describe("daily scheduler job", () => {
  test("needs CRON_SECRET and the right Authorization header", async (t) => {
    assert.equal((await runDaily()).status, 503);
    withEnv(t, { CRON_SECRET: SECRET });
    assert.equal((await runDaily("wrong-secret-123456789")).status, 401);
    assert.equal((await api().post("/api/cron/daily")).status, 401);
    const res = await runDaily();
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { createdEventId: null, events: 0, emailsSent: 0, pushesSent: 0 });
  });

  test("creates next week's match only within AUTO_EVENT_DAYS_BEFORE, without a limit", async (t) => {
    withEnv(t, { CRON_SECRET: SECRET, AUTO_EVENT_DAYS_BEFORE: "1", AUTO_EVENT_MAX_PLAYERS: "none" });
    const admin = await createAdmin();
    await createEvent(admin, { inDays: -5, maxPlayers: "12" }); // next week's is 2 days away

    let res = await runDaily();
    assert.equal(res.body.createdEventId, null, "2 days away, setting is 1");

    process.env.AUTO_EVENT_DAYS_BEFORE = "2";
    res = await runDaily();
    assert.ok(res.body.createdEventId, "created 2 days before");
    const created = (await api().get(`/api/events/${res.body.createdEventId}`)).body;
    assert.equal(created.maxPlayers, undefined, "no player limit");
    const days = (new Date(created.date) - Date.now()) / DAY;
    assert.ok(days > 1.9 && days < 2.1, `about 2 days ahead, got ${days}`);

    res = await runDaily();
    assert.equal(res.body.createdEventId, null, "only one upcoming event at a time");
  });

  test("reminds regulars who haven't answered, once per event", async (t) => {
    withEnv(t, { CRON_SECRET: SECRET });
    const admin = await createAdmin();
    const answered = await createUser({ email: "answered@test.si" });
    const silent = await createUser({ email: "silent@test.si" });
    const newcomer = await createUser({ email: "newcomer@test.si" }); // never played: not a regular

    const past = await createEvent(admin);
    await signUp(answered, past._id);
    await signUp(silent, past._id);
    await moveEvent(admin, past._id, -7);

    const tomorrow = await createEvent(admin, { inDays: 0.8 });
    await signUp(answered, tomorrow._id);

    let res = await runDaily();
    assert.equal(res.body.emailsSent, 1);
    assert.deepEqual(outbox().map((m) => m.to), ["silent@test.si"]);
    assert.match(outbox()[0].subject, /Prideš\?/);

    res = await runDaily();
    assert.equal(res.body.emailsSent, 0, "not reminded twice");
    assert.ok(newcomer);
  });

  test("test mode sends everything only to NOTIFY_TEST_EMAIL", async (t) => {
    const admin = await createAdmin({ email: "admin@test.si" });
    const player = await createUser({ email: "player@test.si" });
    withEnv(t, { NOTIFY_TEST_EMAIL: "Admin@Test.si", NOTIFY_NEW_EVENTS: "true" });
    const past = await createEvent(admin);
    await signUp(player, past._id);
    await moveEvent(admin, past._id, -7);
    outbox().length = 0;

    await createEvent(admin); // announced as a new match
    await new Promise((resolve) => setTimeout(resolve, 200));
    assert.deepEqual(outbox().map((m) => m.to), ["admin@test.si"]);
    assert.match(outbox()[0].subject, /^\[TEST\] Nova tekma/);
  });

  test("new match announcements are off unless NOTIFY_NEW_EVENTS=true", async () => {
    const admin = await createAdmin();
    const player = await createUser();
    const past = await createEvent(admin);
    await signUp(player, past._id);
    await moveEvent(admin, past._id, -7);
    outbox().length = 0;
    await createEvent(admin);
    await new Promise((resolve) => setTimeout(resolve, 200));
    assert.equal(outbox().length, 0);
  });
});

describe("push subscriptions", () => {
  test("push is off without VAPID keys and on with them", async (t) => {
    assert.equal((await api().get("/api/push/public-key")).status, 503);
    const keys = webpush.generateVAPIDKeys();
    withEnv(t, { VAPID_PUBLIC_KEY: keys.publicKey, VAPID_PRIVATE_KEY: keys.privateKey });
    const res = await api().get("/api/push/public-key");
    assert.deepEqual(res.body, { publicKey: keys.publicKey });
  });

  test("devices subscribe with an https endpoint and can unsubscribe", async () => {
    const user = await createUser();
    const subscription = { endpoint: "https://push.example.com/abc", keys: { p256dh: "p", auth: "a" } };
    assert.equal((await api().post("/api/push/subscriptions").send(subscription)).status, 401);
    assert.equal(
      (await api().post("/api/push/subscriptions").set(auth(user)).send({ ...subscription, endpoint: "http://x" })).status,
      400
    );
    assert.equal((await api().post("/api/push/subscriptions").set(auth(user)).send(subscription)).status, 201);
    const res = await api()
      .delete("/api/push/subscriptions")
      .set(auth(user))
      .send({ endpoint: subscription.endpoint });
    assert.equal(res.status, 204);
  });
});
