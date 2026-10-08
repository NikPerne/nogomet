const { parseBoolean } = require("./helpers");

const accountJson = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  admin: user.admin,
  emailNotifications: user.emailNotifications !== false,
});

/**
 * @openapi
 * /me:
 *   get:
 *     summary: The current user's account and settings
 *     tags: [Authentication]
 *     security:
 *      - jwt: []
 *     responses:
 *       '200':
 *         description: _id, name, email, admin and emailNotifications
 *       '401':
 *         description: Not authenticated
 */
const me = (req, res) => res.status(200).json(accountJson(req.user));

/**
 * @openapi
 * /me/settings:
 *   put:
 *     summary: Change the current user's settings
 *     tags: [Authentication]
 *     security:
 *      - jwt: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               emailNotifications:
 *                 type: boolean
 *                 description: Reminder and cancellation emails (password resets are always sent)
 *             required:
 *               - emailNotifications
 *     responses:
 *       '200':
 *         description: The updated account
 *       '400':
 *         description: Invalid value
 *       '401':
 *         description: Not authenticated
 */
const updateSettings = async (req, res) => {
  const emailNotifications = parseBoolean(req.body.emailNotifications);
  if (emailNotifications === undefined)
    return res
      .status(400)
      .json({ message: "Body parameter 'emailNotifications' must be a boolean." });
  try {
    req.user.emailNotifications = emailNotifications;
    await req.user.save();
    res.status(200).json(accountJson(req.user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { me, updateSettings, accountJson };
