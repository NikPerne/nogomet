const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

/**
 * @openapi
 *  components:
 *   schemas:
 *    User:
 *     type: object
 *     description: User of the application.
 *     properties:
 *      email:
 *       type: string
 *       format: email
 *       description: email of the user
 *       example: dejan@lavbic.net
 *      name:
 *       type: string
 *       description: name and surname of the user
 *       example: Dejan Lavbič
 *       writeOnly: true
 *      password:
 *       type: string
 *       description: password of the user
 *       example: test
 *     required:
 *      - email
 *      - name
 *      - password
 *    Authentication:
 *     type: object
 *     description: Authentication token of the user.
 *     properties:
 *      token:
 *       type: string
 *       description: JWT token
 *       example: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NTZiZWRmNDhmOTUzOTViMTlhNjc1ODgiLCJlbWFpbCI6InNpbW9uQGZ1bGxzdGFja3RyYWluaW5nLmNvbSIsIm5hbWUiOiJTaW1vbiBIb2xtZXMiLCJleHAiOjE0MzUwNDA0MTgsImlhdCI6MTQzNDQzNTYxOH0.GD7UrfnLk295rwvIrCikbkAKctFFoRCHotLYZwZpdlE
 *     required:
 *      - token
 */
const usersSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: [true, "Email is required!"] },
  name: { type: String, required: [true, "Name is required!"] },
  hash: { type: String, required: [true, "Hash is required!"] },
  salt: { type: String, required: [true, "Salt is required!"] },
  admin: {type: Boolean, default: false},
  // Opt-out for notification emails (reminders, cancellations); password resets are always sent
  emailNotifications: { type: Boolean, default: true },
  // Password reset: only a SHA-256 hash of the emailed token is stored
  resetTokenHash: { type: String },
  resetTokenExpires: { type: Date },
  resetRequestedAt: { type: Date },
});

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

const hashResetToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

/**
 * Creates a one-time reset token (valid 1 hour) and returns it; only its hash is stored
 */
usersSchema.methods.createResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.resetTokenHash = hashResetToken(token);
  this.resetTokenExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  this.resetRequestedAt = new Date();
  return token;
};

usersSchema.methods.clearResetToken = function () {
  this.resetTokenHash = undefined;
  this.resetTokenExpires = undefined;
};

usersSchema.statics.findByResetToken = function (token) {
  return this.findOne({
    resetTokenHash: hashResetToken(token),
    resetTokenExpires: { $gt: new Date() },
  });
};

usersSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
};

usersSchema.methods.validPassword = function (password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha512");
  const stored = Buffer.from(this.hash, "hex");
  return stored.length === hash.length && crypto.timingSafeEqual(stored, hash);
};

usersSchema.methods.generateJwt = function () {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      admin: this.admin,
      exp: parseInt(expiry.getTime() / 1000),
    },
    process.env.JWT_SECRET
  );
};

mongoose.model("User", usersSchema, "Users");
