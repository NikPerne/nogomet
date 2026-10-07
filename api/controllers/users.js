const mongoose = require("mongoose");
const User = mongoose.model("User");

  /**
   * @openapi
   * /events:
   *   get:
   *     summary: Get a list of events
   *     tags: [Authentication]
   *     security:
   *      - jwt: []
   *     parameters:
   *       - in: query
   *         name: nResults
   *         description: Number of results to return
   *         schema:
   *           type: integer
   *     responses:
   *       '200':
   *         description: Successful response with the list of events
   *       '404':
   *         description: No events found
   *       '500':
   *         description: Internal server error
   */

const userList = async (req, res) => {
    let nResults = parseInt(req.query.nResults);
    nResults = isNaN(nResults) ? 10 : nResults;
    try {
      let users = await User.aggregate([
        { $limit: nResults },
      ]);
      if (!users || users.length == 0)
        res.status(404).json({ message: "No users found." });
      else res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }

  };

  module.exports = {
    userList,
  };