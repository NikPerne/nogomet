const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const { sendMail, appUrl } = require("../config/mail");

/**
 * @openapi
 * /register:
 *  post:
 *   summary: Register a new user
 *   description: <b>Register a new user</b> with name, email and password.
 *   tags: [Authentication]
 *   requestBody:
 *    description: User object
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       $ref: '#/components/schemas/User'
 *   responses:
 *    '200':
 *     description: <b>OK</b>, with JWT token.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Authentication'
 *    '400':
 *     description: <b>Bad Request</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: All fields required.
 *    '409':
 *     description: <b>Conflict</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: User with given e-mail address already registered.
 *    '500':
 *     description: <b>Internal Server Error</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Database not available.
 */
const register = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password)
    return res.status(400).json({ message: "All fields required." });
  const user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.setPassword(req.body.password);
  try {
    await user.save();
    res.status(200).json({ token: user.generateJwt() });
  } catch (err) {
    if (err.code === 11000)
      res.status(409).json({
        message: "User with given e-mail address already registered.",
      });
    else res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /login:
 *  post:
 *   summary: Login a user
 *   description: <b>Login an existing user</b> with email and password.
 *   tags: [Authentication]
 *   requestBody:
 *    description: User credentials
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        email:
 *         type: string
 *         format: email
 *         description: email of the user
 *         example: dejan@lavbic.net
 *        password:
 *         type: string
 *         description: password of the user
 *         example: test
 *       required:
 *        - email
 *        - password
 *   responses:
 *    '200':
 *     description: <b>OK</b>, with JWT token.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Authentication'
 *    '400':
 *     description: <b>Bad Request</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: All fields required.
 *    '401':
 *     description: <b>Unauthorized</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        incorrect username:
 *         value:
 *          message: Incorrect username.
 *        incorrect password:
 *         value:
 *          message: Incorrect password.
 *    '500':
 *     description: <b>Internal Server Error</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Database not available.
 */
const login = (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).json({ message: "All fields required." });
  else
    passport.authenticate("local", (err, user, info) => {
      if (err) return res.status(500).json({ message: err.message });
      if (user) return res.status(200).json({ token: user.generateJwt() });
      else return res.status(401).json({ message: info.message });
    })(req, res);
};

/** Same minimum as the register and login forms */
const MIN_PASSWORD_LENGTH = 3;

/**
 * @openapi
 * /me/password:
 *  put:
 *   summary: Change the current user's password
 *   tags: [Authentication]
 *   security:
 *    - jwt: []
 *   requestBody:
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        currentPassword:
 *         type: string
 *        newPassword:
 *         type: string
 *         description: At least 3 characters
 *       required:
 *        - currentPassword
 *        - newPassword
 *   responses:
 *    '204':
 *     description: Password changed
 *    '400':
 *     description: Missing fields or new password too short
 *    '401':
 *     description: Not authenticated, or current password is wrong
 *    '500':
 *     description: Internal server error
 */
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    return res.status(400).json({ message: "All fields required." });
  if (newPassword.length < MIN_PASSWORD_LENGTH)
    return res.status(400).json({
      message: `New password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
    });
  if (!req.user.validPassword(currentPassword))
    return res.status(401).json({ message: "Current password is incorrect." });
  try {
    req.user.setPassword(newPassword);
    await req.user.save();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/** A new reset email is sent at most once per minute per account */
const RESET_RESEND_INTERVAL_MS = 60 * 1000;

const escapeHtml = (text) =>
  text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const sendResetEmail = (user, link) =>
  sendMail({
    to: user.email,
    toName: user.name,
    subject: "Nogomet – ponastavitev gesla",
    text:
      `Pozdravljen/a ${user.name},\n\n` +
      `za ponastavitev gesla odpri to povezavo (velja 1 uro):\n${link}\n\n` +
      "Če ponastavitve nisi zahteval/a, to sporočilo prezri – tvoje geslo ostane nespremenjeno.",
    html:
      `<p>Pozdravljen/a ${escapeHtml(user.name)},</p>` +
      `<p>za ponastavitev gesla klikni na povezavo (velja 1 uro):</p>` +
      `<p><a href="${link}">Ponastavi geslo</a></p>` +
      "<p>Če ponastavitve nisi zahteval/a, to sporočilo prezri – tvoje geslo ostane nespremenjeno.</p>",
  });

/**
 * @openapi
 * /password/forgot:
 *  post:
 *   summary: Request a password reset email
 *   description: >
 *     Always responds with the same message, whether or not an account with the e-mail exists,
 *     so the endpoint can't be used to find out who is registered. The emailed link is valid
 *     for 1 hour; a new email is sent at most once per minute.
 *   tags: [Authentication]
 *   requestBody:
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        email:
 *         type: string
 *         format: email
 *       required:
 *        - email
 *   responses:
 *    '200':
 *     description: Generic confirmation message
 *    '400':
 *     description: E-mail missing
 */
const forgotPassword = async (req, res) => {
  const email = typeof req.body.email === "string" ? req.body.email.trim() : "";
  if (!email) return res.status(400).json({ message: "E-mail address is required." });
  // Respond before doing any work, so neither the message nor the response time
  // reveals whether an account with this e-mail exists
  res.status(200).json({
    message: "If an account with this e-mail exists, we sent a link to reset the password.",
  });
  try {
    const user = await User.findOne({ email }).exec();
    const recentlySent =
      user?.resetRequestedAt &&
      Date.now() - user.resetRequestedAt.getTime() < RESET_RESEND_INTERVAL_MS;
    if (user && !recentlySent) {
      const token = user.createResetToken();
      await user.save();
      await sendResetEmail(user, `${appUrl()}/ponastavi-geslo?token=${token}`);
    }
  } catch (err) {
    console.error("Password reset email failed:", err.message);
  }
};

/**
 * @openapi
 * /password/reset:
 *  post:
 *   summary: Set a new password with the token from the reset email
 *   description: The token works once. On success the user is logged in (JWT returned).
 *   tags: [Authentication]
 *   requestBody:
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        token:
 *         type: string
 *        newPassword:
 *         type: string
 *         description: At least 3 characters
 *       required:
 *        - token
 *        - newPassword
 *   responses:
 *    '200':
 *     description: Password changed, with JWT token
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Authentication'
 *    '400':
 *     description: Missing fields, password too short, or link invalid or expired
 *    '500':
 *     description: Internal server error
 */
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  if (typeof token !== "string" || !token || typeof newPassword !== "string" || !newPassword)
    return res.status(400).json({ message: "All fields required." });
  if (newPassword.length < MIN_PASSWORD_LENGTH)
    return res.status(400).json({
      message: `New password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
    });
  try {
    const user = await User.findByResetToken(token).exec();
    if (!user)
      return res
        .status(400)
        .json({ message: "The reset link is invalid or has expired. Request a new one." });
    user.setPassword(newPassword);
    user.clearResetToken();
    await user.save();
    res.status(200).json({ token: user.generateJwt() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  register,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
};
