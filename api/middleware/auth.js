const mongoose = require("mongoose");
const { expressjwt } = require("express-jwt");
const User = mongoose.model("User");

/**
 * Verifies the JWT and exposes its payload on req.auth
 */
const verifyJwt = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

/**
 * Loads the authenticated user from the database into req.user
 */
const loadUser = async (req, res, next) => {
  try {
    const user = req.auth?._id ? await User.findById(req.auth._id).exec() : null;
    if (!user) return res.status(401).json({ message: "User not found." });
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Allows the request only for administrators (checked against the database, not the token)
 */
const requireAdmin = (req, res, next) => {
  if (!req.user.admin)
    return res
      .status(403)
      .json({ message: "Only administrators can manage events." });
  next();
};

module.exports = {
  auth: [verifyJwt, loadUser],
  adminOnly: [verifyJwt, loadUser, requireAdmin],
};
