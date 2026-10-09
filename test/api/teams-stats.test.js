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

const saveTeams = (admin, eventId, teams) =>
  api().put(`/api/events/${eventId}/teams`).set(auth(admin)).send(teams);
const saveScore = (admin, eventId, rumeni, rdeci) =>
  api().put(`/api/events/${eventId}/score`).set(auth(admin)).type("form").send({ rumeni, rdeci });
const vote = (user, eventId, playerKey) =>
  api().put(`/api/events/${eventId}/mvp`).set(auth(user)).type("form").send({ playerKey });

/**
 * A finished match (kick-off an hour ago): Nik and Ana played for Rumeni, Leo for Rdeči
 */
const playedMatch = async () => {
  const admin = await createAdmin();
  const nik = await createUser({ name: "Nik" });
  const ana = await createUser({ name: "Ana" });
  const leo = await createUser({ name: "Leo" });
  const event = await createEvent(admin);
  for (const user of [nik, ana, leo]) await signUp(user, event._id);
  await moveEvent(admin, event._id, -1 / 24);
  return { admin, nik, ana, leo, event };
};

describe("teams and score", () => {
  test("only admins save teams; a score needs saved teams", async () => {
    const { admin, nik, event } = await playedMatch();
    const teams = { rumeni: [{ name: "Nik", userId: nik._id }], rdeci: [] };
    assert.equal((await saveTeams(nik, event._id, teams)).status, 403);
    assert.equal((await saveScore(admin, event._id, 1, 0)).status, 409);
    assert.equal((await saveTeams(admin, event._id, teams)).status, 200);
    assert.equal((await saveScore(admin, event._id, "x", 0)).status, 400);
    assert.equal((await saveScore(admin, event._id, 3, 1)).status, 200);
  });

  test("a player can't be in both teams", async () => {
    const { admin, nik, event } = await playedMatch();
    const res = await saveTeams(admin, event._id, {
      rumeni: [{ name: "Nik", userId: nik._id }],
      rdeci: [{ name: "Nik", userId: nik._id }],
    });
    assert.equal(res.status, 400);
  });

  test("wins, losses and the player page follow the score", async () => {
    const { admin, nik, ana, leo, event } = await playedMatch();
    await saveTeams(admin, event._id, {
      rumeni: [
        { name: "Nik", userId: nik._id },
        { name: "Ana", userId: ana._id },
      ],
      rdeci: [{ name: "Leo", userId: leo._id }],
    });
    await saveScore(admin, event._id, 3, 1);

    const stats = (await api().get("/api/users?nResults=100")).body;
    const byName = Object.fromEntries(stats.map((p) => [p.name, p]));
    assert.deepEqual([byName.Nik.wins, byName.Nik.losses, byName.Nik.gamesPlayed], [1, 0, 1]);
    assert.deepEqual([byName.Leo.wins, byName.Leo.losses], [0, 1]);

    const history = await api().get(`/api/users/${leo._id}`).set(auth(nik));
    assert.equal(history.status, 200);
    assert.deepEqual(
      history.body.matches.map(({ status, team, result }) => ({ status, team, result })),
      [{ status: "played", team: "rdeci", result: "loss" }]
    );
  });
});

describe("player of the match", () => {
  test("players vote after kick-off, not for themselves; votes stay secret", async () => {
    const { admin, nik, ana, leo, event } = await playedMatch();
    const outsider = await createUser();

    assert.equal((await vote(nik, event._id, nik._id)).status, 400, "no self vote");
    assert.equal((await vote(outsider, event._id, ana._id)).status, 403, "only players");
    assert.equal((await vote(nik, event._id, ana._id)).status, 200);
    const res = await vote(leo, event._id, ana._id);
    assert.equal(res.status, 200);
    assert.deepEqual(res.body.event.mvpTally, [{ key: ana._id, name: "Ana", votes: 2 }]);

    const publicEvent = (await api().get(`/api/events/${event._id}`)).body;
    assert.equal(publicEvent.mvpVotes, undefined, "who voted for whom is not exposed");
    const status = (await api().get(`/api/events/${event._id}/mvp`).set(auth(nik))).body;
    assert.equal(status.myVote, ana._id);

    const stats = (await api().get("/api/users?nResults=100")).body;
    assert.equal(stats.find((p) => p.name === "Ana").mvpAwards, 1);
    assert.ok(admin);
  });

  test("voting isn't open before kick-off", async () => {
    const admin = await createAdmin();
    const [a, b] = [await createUser(), await createUser()];
    const event = await createEvent(admin);
    await signUp(a, event._id);
    await signUp(b, event._id);
    assert.equal((await vote(a, event._id, b._id)).status, 409);
  });
});

describe("statistics", () => {
  test("/api/users never exposes emails or password hashes", async () => {
    await createUser();
    const [player] = (await api().get("/api/users")).body;
    assert.deepEqual(
      Object.keys(player).sort(),
      ["_id", "attendanceRate", "currentStreak", "draws", "gamesPlayed", "lastPlayed", "losses", "mvpAwards", "name", "wins"]
    );
  });

  test("cancelled events don't count; the season filter limits the events", async () => {
    const { admin, nik, event } = await playedMatch();
    const cancelled = await createEvent(admin);
    await signUp(nik, cancelled._id);
    await moveEvent(admin, cancelled._id, -2);
    await api().put(`/api/events/${cancelled._id}`).set(auth(admin)).type("form").send({ cancelled: "true" });

    const all = (await api().get("/api/users?nResults=100")).body;
    assert.equal(all.find((p) => p.name === "Nik").gamesPlayed, 1);
    const oldSeason = (await api().get("/api/users?nResults=100&season=2020/21")).body;
    assert.equal(oldSeason.find((p) => p.name === "Nik").gamesPlayed, 0);
    assert.equal((await api().get("/api/users?season=nonsense")).status, 400);
    assert.ok(event);
  });
});
