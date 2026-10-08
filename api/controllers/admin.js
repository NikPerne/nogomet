const mongoose = require("mongoose");
const User = mongoose.model("User");
const SeasonPayment = mongoose.model("SeasonPayment");
const PushSubscription = mongoose.model("PushSubscription");
const { isValidId, parseBoolean } = require("./helpers");
const { accountJson } = require("./account");

const userNotFound = (res, userId) =>
  res.status(404).json({ message: `User with id '${userId}' not found.` });

/**
 * @openapi
 * /admin/users:
 *   get:
 *     summary: All user accounts (administrators only)
 *     tags: [Admin]
 *     security:
 *      - jwt: []
 *     responses:
 *       '200':
 *         description: Users with _id, name, email, admin and emailNotifications, by name
 *       '401':
 *         description: Not authenticated
 *       '403':
 *         description: Not an administrator
 */
const listUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("name email admin emailNotifications")
      .sort({ name: 1 })
      .exec();
    res.status(200).json(users.map(accountJson));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /admin/users/{userId}:
 *   put:
 *     summary: Grant or remove admin rights (administrators only)
 *     description: Admins can't remove their own admin rights, so there is always at least one admin.
 *     tags: [Admin]
 *     security:
 *      - jwt: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               admin:
 *                 type: boolean
 *             required:
 *               - admin
 *     responses:
 *       '200':
 *         description: The updated user
 *       '400':
 *         description: Invalid value
 *       '404':
 *         description: User not found
 *       '409':
 *         description: Can't remove your own admin rights
 *   delete:
 *     summary: Delete a user account (administrators only)
 *     description: >
 *       Also deletes the user's season payments and push subscriptions. Their past signups stay on events (under the
 *       same name) but no longer count in statistics. Admins can't delete their own account.
 *     tags: [Admin]
 *     security:
 *      - jwt: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: User deleted
 *       '404':
 *         description: User not found
 *       '409':
 *         description: Can't delete your own account
 */
const setAdmin = async (req, res) => {
  const { userId } = req.params;
  const admin = parseBoolean(req.body.admin);
  if (admin === undefined)
    return res.status(400).json({ message: "Body parameter 'admin' must be a boolean." });
  if (!isValidId(userId)) return userNotFound(res, userId);
  if (!admin && req.user._id.equals(userId))
    return res
      .status(409)
      .json({ message: "You can't remove your own admin rights." });
  try {
    const user = await User.findByIdAndUpdate(userId, { admin }, { new: true }).exec();
    if (!user) return userNotFound(res, userId);
    res.status(200).json(accountJson(user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;
  if (!isValidId(userId)) return userNotFound(res, userId);
  if (req.user._id.equals(userId))
    return res.status(409).json({ message: "You can't delete your own account." });
  try {
    const user = await User.findByIdAndDelete(userId).exec();
    if (!user) return userNotFound(res, userId);
    await SeasonPayment.deleteMany({ userId }).exec();
    await PushSubscription.deleteMany({ userId }).exec();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { listUsers, setAdmin, deleteUser };
