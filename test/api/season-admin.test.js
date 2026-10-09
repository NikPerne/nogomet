const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const { setupApi, api, auth, createUser, createAdmin, createEvent, signUp } = require("./helpers");

setupApi();

describe("season fees", () => {
  test("players of the season are listed; only admins mark payments", async () => {
    const admin = await createAdmin();
    const nik = await createUser({ name: "Nik" });
    await createUser({ name: "Ana" }); // never signed up this season
    const event = await createEvent(admin);
    await signUp(nik, event._id);

    let res = await api().get("/api/season").set(auth(nik));
    assert.equal(res.status, 200);
    assert.equal(res.body.fee, 80);
    assert.deepEqual(res.body.players.map((p) => p.name), ["Nik"]);

    const pay = (user, paid) =>
      api().put(`/api/season/payments/${nik._id}`).set(auth(user)).type("form").send({ paid: String(paid) });
    assert.equal((await pay(nik, true)).status, 403);
    res = await pay(admin, true);
    assert.equal(res.status, 200);
    assert.ok(res.body.paidOn);

    res = await api().get("/api/season").set(auth(nik));
    assert.deepEqual([res.body.paidCount, res.body.collected], [1, 80]);
    await pay(admin, false);
    res = await api().get("/api/season").set(auth(nik));
    assert.equal(res.body.paidCount, 0);
  });
});

describe("user administration", () => {
  test("admins list users, grant admin, and can't lock themselves out", async () => {
    const admin = await createAdmin();
    const user = await createUser();
    assert.equal((await api().get("/api/admin/users").set(auth(user))).status, 403);
    const list = await api().get("/api/admin/users").set(auth(admin));
    assert.equal(list.body.length, 2);

    let res = await api().put(`/api/admin/users/${user._id}`).set(auth(admin)).type("form").send({ admin: "true" });
    assert.equal(res.body.admin, true);
    res = await api().put(`/api/admin/users/${admin._id}`).set(auth(admin)).type("form").send({ admin: "false" });
    assert.equal(res.status, 409, "can't remove own admin rights");
    assert.equal((await api().delete(`/api/admin/users/${admin._id}`).set(auth(admin))).status, 409);
  });

  test("deleting a user removes the account", async () => {
    const admin = await createAdmin();
    const user = await createUser();
    assert.equal((await api().delete(`/api/admin/users/${user._id}`).set(auth(admin))).status, 204);
    const res = await api().post("/api/login").type("form").send({ email: user.email, password: user.password });
    assert.equal(res.status, 401);
  });

  test("admins see the invite code", async (t) => {
    const admin = await createAdmin();
    process.env.REGISTRATION_CODE = "Torek-123";
    t.after(() => delete process.env.REGISTRATION_CODE);
    const res = await api().get("/api/admin/invite-code").set(auth(admin));
    assert.equal(res.body.inviteCode, "Torek-123");
  });
});
