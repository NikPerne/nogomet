const crypto = require("crypto");

/**
 * Invite code for registration (REGISTRATION_CODE). When set, new accounts need it, so
 * only people the admin shares it with (e.g. in the group chat) can register.
 * Without it, registration is open.
 */
const inviteCode = () => process.env.REGISTRATION_CODE?.trim() || null;

const normalize = (code) => String(code ?? "").trim().toLowerCase();

const digest = (text) => crypto.createHash("sha256").update(text).digest();

/**
 * Case-insensitive, constant-time comparison with the configured code
 */
const matchesInviteCode = (given) => {
  const code = inviteCode();
  if (!code) return true;
  return crypto.timingSafeEqual(digest(normalize(given)), digest(normalize(code)));
};

module.exports = { inviteCode, matchesInviteCode };
