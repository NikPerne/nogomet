const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const {
  setupApi,
  api,
  auth,
  createUser,
  createAdmin,
  createEvent,
  signUp,
  outbox,
  waitFor,
  DAY,
} = require("./helpers");

setupApi();

describe("events", () => {
  test("only admins can create events", async () => {
    const user = await createUser();
    const body = { name: "Nogomet", description: "d", date: new Date(Date.now() + DAY).toISOString() };
    assert.equal((await api().post("/api/events").type("form").send(body)).status, 401);
    assert.equal((await api().post("/api/events").set(auth(user)).type("form").send(body)).status, 403);
    const admin = await createAdmin();
    const res = await api().post("/api/events").set(auth(admin)).type("form").send(body);
    assert.equal(res.status, 201);
    assert.equal(res.body.name, "Nogomet");
  });

  test("invalid event fields are rejected", async () => {
    const admin = await createAdmin();
    const res = await api().post("/api/events").set(auth(admin)).type("form").send({ name: "No description" });
    assert.equal(res.status, 400);
  });

  test("list is newest first and empty list is 200 []", async () => {
    assert.deepEqual((await api().get("/api/events")).body, []);
    const admin = await createAdmin();
    await createEvent(admin, { inDays: 1, name: "Prvi" });
    await createEvent(admin, { inDays: 8, name: "Drugi" });
    const res = await api().get("/api/events");
    assert.deepEqual(res.body.map((e) => e.name), ["Drugi", "Prvi"]);
  });

  test("unknown and invalid ids give 404", async () => {
    assert.equal((await api().get("/api/events/655b4c518bfcc3e808a86762")).status, 404);
    assert.equal((await api().get("/api/events/not-an-id")).status, 404);
  });

  test("admin can edit only the editable fields", async () => {
    const admin = await createAdmin();
    const event = await createEvent(admin);
    const res = await api()
      .put(`/api/events/${event._id}`)
      .set(auth(admin))
      .type("form")
      .send({ name: "Spremenjeno", maxPlayers: "12", signedup: "hack" });
    assert.equal(res.status, 200);
    assert.equal(res.body.name, "Spremenjeno");
    assert.equal(res.body.maxPlayers, 12);
    assert.deepEqual(res.body.signedup, []);
  });

  test("cancelling notifies players who said Pridem; restoring clears the reason", async () => {
    const admin = await createAdmin();
    const coming = await createUser({ email: "pride@test.si" });
    const notComing = await createUser({ email: "nepride@test.si" });
    const event = await createEvent(admin);
    await signUp(coming, event._id, true);
    await signUp(notComing, event._id, false);

    let res = await api()
      .put(`/api/events/${event._id}`)
      .set(auth(admin))
      .type("form")
      .send({ cancelled: "true", cancelReason: "Dež" });
    assert.equal(res.body.cancelled, true);
    const mail = await waitFor(() => outbox().find((m) => m.to === "pride@test.si"));
    assert.match(mail.subject, /Odpovedano/);
    assert.match(mail.text, /Dež/);
    assert.equal(outbox().some((m) => m.to === "nepride@test.si"), false);

    res = await api().put(`/api/events/${event._id}`).set(auth(admin)).type("form").send({ cancelled: "false" });
    assert.equal(res.body.cancelled, false);
    assert.equal(res.body.cancelReason ?? null, null);
  });

  test("admin can delete an event", async () => {
    const admin = await createAdmin();
    const event = await createEvent(admin);
    assert.equal((await api().delete(`/api/events/${event._id}`).set(auth(admin))).status, 204);
    assert.equal((await api().get(`/api/events/${event._id}`)).status, 404);
  });

  test("unknown API routes answer JSON 404 and the docs are served", async () => {
    const res = await api().get("/api/does-not-exist");
    assert.equal(res.status, 404);
    assert.match(res.body.message, /not found/);
    const docs = await api().get("/api/swagger.json");
    assert.equal(docs.status, 200);
    assert.ok(docs.body.paths["/events"]);
  });
});
