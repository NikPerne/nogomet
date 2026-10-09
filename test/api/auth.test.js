const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const { setupApi, api, auth, jwtPayload, createUser, outbox, waitFor } = require("./helpers");

setupApi();

describe("registration and login", () => {
  test("register returns a token with the user's name and admin flag", async () => {
    const res = await api()
      .post("/api/register")
      .type("form")
      .send({ name: "Nik", email: "nik@test.si", password: "geslo123" });
    assert.equal(res.status, 200);
    const payload = jwtPayload(res.body.token);
    assert.equal(payload.name, "Nik");
    assert.equal(payload.admin, false);
  });

  test("register rejects missing fields and duplicate e-mails", async () => {
    let res = await api().post("/api/register").type("form").send({ name: "Nik" });
    assert.equal(res.status, 400);
    await createUser({ email: "same@test.si" });
    res = await api()
      .post("/api/register")
      .type("form")
      .send({ name: "Other", email: "same@test.si", password: "abc" });
    assert.equal(res.status, 409);
  });

  test("login works with the right password only", async () => {
    const user = await createUser();
    let res = await api().post("/api/login").type("form").send({ email: user.email, password: user.password });
    assert.equal(res.status, 200);
    assert.ok(res.body.token);
    res = await api().post("/api/login").type("form").send({ email: user.email, password: "wrong" });
    assert.equal(res.status, 401);
  });

  test("invite code is required when REGISTRATION_CODE is set (case-insensitive)", async (t) => {
    process.env.REGISTRATION_CODE = "Torek-123";
    t.after(() => delete process.env.REGISTRATION_CODE);

    let res = await api().get("/api/registration");
    assert.deepEqual(res.body, { inviteCodeRequired: true });
    const body = { name: "Ana", email: "ana@test.si", password: "geslo123" };
    res = await api().post("/api/register").type("form").send(body);
    assert.equal(res.status, 403, "no code");
    res = await api().post("/api/register").type("form").send({ ...body, inviteCode: "wrong" });
    assert.equal(res.status, 403, "wrong code");
    res = await api().post("/api/register").type("form").send({ ...body, inviteCode: " torek-123 " });
    assert.equal(res.status, 200, "right code, different case and spaces");
  });

  test("registration is open without REGISTRATION_CODE", async () => {
    const res = await api().get("/api/registration");
    assert.deepEqual(res.body, { inviteCodeRequired: false });
  });
});

describe("account", () => {
  test("/me needs a login and returns own account", async () => {
    assert.equal((await api().get("/api/me")).status, 401);
    const user = await createUser({ name: "Nik" });
    const res = await api().get("/api/me").set(auth(user));
    assert.equal(res.status, 200);
    assert.equal(res.body.name, "Nik");
    assert.equal(res.body.emailNotifications, true);
    assert.equal(res.body.hash, undefined);
  });

  test("email notifications can be turned off", async () => {
    const user = await createUser();
    const res = await api().put("/api/me/settings").set(auth(user)).type("form").send({ emailNotifications: "false" });
    assert.equal(res.status, 200);
    assert.equal(res.body.emailNotifications, false);
  });

  test("change password needs the current password", async () => {
    const user = await createUser();
    let res = await api()
      .put("/api/me/password")
      .set(auth(user))
      .type("form")
      .send({ currentPassword: "wrong", newPassword: "novo123" });
    assert.equal(res.status, 401);
    res = await api()
      .put("/api/me/password")
      .set(auth(user))
      .type("form")
      .send({ currentPassword: user.password, newPassword: "novo123" });
    assert.equal(res.status, 204);
    res = await api().post("/api/login").type("form").send({ email: user.email, password: "novo123" });
    assert.equal(res.status, 200);
  });
});

describe("forgot password", () => {
  test("same answer for known and unknown e-mails, reset link works once", async () => {
    const user = await createUser();
    const unknown = await api().post("/api/password/forgot").type("form").send({ email: "nobody@test.si" });
    const known = await api().post("/api/password/forgot").type("form").send({ email: user.email });
    assert.equal(known.status, 200);
    assert.deepEqual(known.body, unknown.body, "no account enumeration");

    const mail = await waitFor(() => outbox().find((m) => m.to === user.email));
    assert.equal(outbox().filter((m) => m.to === "nobody@test.si").length, 0);
    const token = /ponastavi-geslo\?token=([0-9a-f]{64})/.exec(mail.text)[1];

    let res = await api().post("/api/password/reset").type("form").send({ token, newPassword: "novo123" });
    assert.equal(res.status, 200);
    assert.ok(res.body.token, "logged in after reset");
    res = await api().post("/api/login").type("form").send({ email: user.email, password: "novo123" });
    assert.equal(res.status, 200);
    res = await api().post("/api/password/reset").type("form").send({ token, newPassword: "drugo123" });
    assert.equal(res.status, 400, "token works only once");
  });
});
