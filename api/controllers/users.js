const mongoose = require("mongoose");
const User = mongoose.model("User");
const { parseLimit } = require("./helpers");

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get users' public signup statistics, most active first
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: nResults
 *         description: Number of results to return (1-1000, default 10)
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: List of users with name and timesSignedUp (may be empty)
 *       '500':
 *         description: Internal server error
 */
const userList = async (req, res) => {
  try {
    // Only expose public fields: never email, hash or salt
    const users = await User.find()
      .select("name timesSignedUp")
      .sort({ timesSignedUp: -1 })
      .limit(parseLimit(req.query.nResults))
      .exec();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  userList,
};
