/**
 * Season membership: one fee per season instead of per match.
 * The fee can be overridden with the SEASON_FEE_EUR environment variable.
 */
const SEASON_FEE_EUR = Number(process.env.SEASON_FEE_EUR) || 80;

const OCTOBER = 9; // 0-based months
const MAY = 4;

const label = (startYear) => `${startYear}/${String(startYear + 1).slice(-2)}`;

const seasonStartingIn = (startYear) => ({
  label: label(startYear),
  start: new Date(startYear, OCTOBER, 1),
  end: new Date(startYear + 1, MAY, 1), // exclusive: the season ends on 30 April
});

/**
 * The season a date belongs to (1 October – 30 April). Dates in the summer break
 * (May – September) belong to the upcoming season.
 */
const seasonFor = (date = new Date()) =>
  seasonStartingIn(date.getMonth() >= MAY ? date.getFullYear() : date.getFullYear() - 1);

/**
 * Parses a season label like "2026/27"; returns null when invalid
 */
const parseSeason = (value) => {
  const match = /^(\d{4})\/(\d{2})$/.exec(value ?? "");
  if (!match) return null;
  const startYear = Number(match[1]);
  return String(startYear + 1).slice(-2) === match[2]
    ? seasonStartingIn(startYear)
    : null;
};

module.exports = { SEASON_FEE_EUR, seasonFor, parseSeason };
