const mongoose = require("mongoose");
const User = mongoose.model("User");

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