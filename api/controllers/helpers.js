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

module.exports = { parseLimit, isValidId };
