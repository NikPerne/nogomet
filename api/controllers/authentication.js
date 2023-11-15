const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");

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

module.exports = {
  register,
  login,
};
