const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const {
  setupApi,
  api,
  auth,
  createUser,
  createAdmin,
  createEvent,
  moveEvent,
  signUp,
} = require("./helpers");

setupApi();

const getEvent = async (eventId) => (await api().get(`/api/events/${eventId}`)).body;
const statsOf = async (user) =>
  (await api().get("/api/users?nResults=100")).body.find((p) => p._id === user._id);

describe("signups", () => {
  test("sign up once, change the answer and the note, then remove it", async () => {
    const admin = await createAdmin();
    const user = await createUser();
    const event = await createEvent(admin);

    let res = await signUp(user, event._id, true, { note: "pridem kasneje" });
    assert.equal(res.status, 201);
    assert.equal(res.body.note, "pridem kasneje");
    const signupId = res.body._id;

    assert.equal((await signUp(user, event._id, false)).status, 409, "only one own signup");

    res = await api()
      .put(`/api/events/${event._id}/signups/${signupId}`)
      .set(auth(user))
      .type("form")
      .send({ attending: "false", note: "" });
    assert.equal(res.status, 200);
    assert.equal(res.body.attending, false);
    assert.equal(res.body.note, undefined, "empty note removes it");

    res = await api().delete(`/api/events/${event._id}/signups/${signupId}`).set(auth(user));
    assert.equal(res.status, 204);
    assert.deepEqual((await getEvent(event._id)).signedup, []);
  });

  test("players can't change or delete someone else's signup", async () => {
    const admin = await createAdmin();
    const owner = await createUser();
    const other = await createUser();
    const event = await createEvent(admin);
    const signupId = (await signUp(owner, event._id)).body._id;
    const path = `/api/events/${event._id}/signups/${signupId}`;
    assert.equal((await api().put(path).set(auth(other)).type("form").send({ attending: "false" })).status, 403);
    assert.equal((await api().delete(path).set(auth(other))).status, 403);
  });

  test("full events take extra players on the waitlist, who don't count as played", async () => {
    const admin = await createAdmin();
    const [a, b, c] = [await createUser(), await createUser(), await createUser()];
    const event = await createEvent(admin, { maxPlayers: "2" });
    for (const user of [a, b, c]) assert.equal((await signUp(user, event._id)).status, 201);

    // Kick-off yesterday: a and b played, c was waitlisted
    await moveEvent(admin, event._id, -1);
    assert.equal((await statsOf(a)).gamesPlayed, 1);
    assert.equal((await statsOf(b)).gamesPlayed, 1);
    assert.equal((await statsOf(c)).gamesPlayed, 0);
  });

  test("a dropout promotes the first player on the waitlist", async () => {
    const admin = await createAdmin();
    const [a, b, c] = [await createUser(), await createUser(), await createUser()];
    const event = await createEvent(admin, { maxPlayers: "2" });
    const aSignup = (await signUp(a, event._id)).body._id;
    await signUp(b, event._id);
    await signUp(c, event._id);
    await api()
      .put(`/api/events/${event._id}/signups/${aSignup}`)
      .set(auth(a))
      .type("form")
      .send({ attending: "false" });
    await moveEvent(admin, event._id, -1);
    assert.equal((await statsOf(a)).gamesPlayed, 0);
    assert.equal((await statsOf(c)).gamesPlayed, 1, "c moved up");
  });

  test("past and cancelled events are locked", async () => {
    const admin = await createAdmin();
    const user = await createUser();
    const past = await createEvent(admin, { inDays: -2 });
    assert.equal((await signUp(user, past._id)).status, 409);

    const cancelled = await createEvent(admin);
    await api().put(`/api/events/${cancelled._id}`).set(auth(admin)).type("form").send({ cancelled: "true" });
    const res = await signUp(user, cancelled._id);
    assert.equal(res.status, 409);
    assert.match(res.body.message, /cancelled/);
  });
});

describe("guests", () => {
  const addGuest = (user, eventId, name) =>
    api().post(`/api/events/${eventId}/guests`).set(auth(user)).type("form").send({ name });

  test("players can bring up to 3 guests, admins more", async () => {
    const admin = await createAdmin();
    const user = await createUser();
    const event = await createEvent(admin);
    for (const name of ["G1", "G2", "G3"]) assert.equal((await addGuest(user, event._id, name)).status, 201);
    assert.equal((await addGuest(user, event._id, "G4")).status, 409);
    for (const name of ["A1", "A2", "A3", "A4"]) assert.equal((await addGuest(admin, event._id, name)).status, 201);
  });

  test("the host can remove their guest, others can't", async () => {
    const admin = await createAdmin();
    const host = await createUser();
    const other = await createUser();
    const event = await createEvent(admin);
    const guest = (await addGuest(host, event._id, "Prijatelj")).body;
    assert.equal(guest.guestOfName, host.name);
    const path = `/api/events/${event._id}/signups/${guest._id}`;
    assert.equal((await api().delete(path).set(auth(other))).status, 403);
    assert.equal((await api().delete(path).set(auth(host))).status, 204);
  });

  test("a guest doesn't count as the host's own signup", async () => {
    const admin = await createAdmin();
    const host = await createUser();
    const event = await createEvent(admin);
    await addGuest(host, event._id, host.name); // guest with the same name as the host
    assert.equal((await signUp(host, event._id)).status, 201, "host can still sign up");
  });
});
