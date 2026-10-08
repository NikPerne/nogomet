const mongoose = require("mongoose");

const DEFAULT_RESULTS = 10;
const MAX_RESULTS = 1000;

/**
 * Parses the nResults query parameter into a positive, bounded integer
 */
const parseLimit = (value) => {
  const n = parseInt(value, 10);
  if (isNaN(n) || n < 1) return DEFAULT_RESULTS;
  return Math.min(n, MAX_RESULTS);
};

const isValidId = (id) => mongoose.isValidObjectId(id);

/**
 * Form bodies send booleans as strings, so accept both representations
 */
const parseBoolean = (value) => {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return undefined;
};

/**
 * The user's own signup (never a guest they added). Signups created before
 * userId was stored can only be matched by name.
 */
const isOwnSignup = (signup, user) =>
  !signup.guestOf &&
  (signup.userId ? signup.userId.equals(user._id) : signup.name === user.name);

module.exports = { parseLimit, isValidId, parseBoolean, isOwnSignup };
