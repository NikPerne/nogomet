/**
 * Transactional email via the Brevo HTTP API (no SMTP, so it works on hosts that block SMTP ports).
 * Configure BREVO_API_KEY and MAIL_FROM (a sender verified in Brevo), optionally MAIL_FROM_NAME.
 * Without configuration, emails are printed to the console outside production.
 */
const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

const isProduction = () => process.env.NODE_ENV === "production";

/**
 * Base URL of the app for links in emails. Never derived from the request's Host header,
 * since an attacker could set it to their own domain and receive reset tokens.
 */
const appUrl = () => {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/+$/, "");
  if (isProduction()) throw new Error("APP_URL is not configured.");
  const protocol = process.env.HTTPS === "true" ? "https" : "http";
  return `${protocol}://localhost:${process.env.PORT || 3000}`;
};

/**
 * Emails that were printed instead of sent (no Brevo configuration, not production), newest
 * last. Tests read it to check who got what.
 */
const outbox = [];
const OUTBOX_SIZE = 100;

const sendMail = async ({ to, toName, subject, text, html }) => {
  // Trimmed, since keys pasted into hosting dashboards often pick up stray whitespace
  const BREVO_API_KEY = process.env.BREVO_API_KEY?.trim();
  const MAIL_FROM = process.env.MAIL_FROM?.trim();
  const { MAIL_FROM_NAME } = process.env;
  if (BREVO_API_KEY?.startsWith("xsmtpsib-"))
    throw new Error(
      "BREVO_API_KEY is an SMTP key (xsmtpsib-...). Create an API key (xkeysib-...) under SMTP & API → API keys."
    );
  if (!BREVO_API_KEY || !MAIL_FROM) {
    if (isProduction())
      throw new Error("Email is not configured (BREVO_API_KEY and MAIL_FROM).");
    console.log(`[mail] Not configured, printing instead.\nTo: ${to}\nSubject: ${subject}\n${text}`);
    outbox.push({ to, subject, text });
    if (outbox.length > OUTBOX_SIZE) outbox.shift();
    return;
  }
  const response = await fetch(BREVO_URL, {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { email: MAIL_FROM, name: MAIL_FROM_NAME || "Nogomet" },
      to: [{ email: to, name: toName }],
      subject,
      textContent: text,
      htmlContent: html,
    }),
  });
  if (!response.ok)
    throw new Error(`Sending email failed: ${response.status} ${await response.text()}`);
};

const escapeHtml = (text) =>
  String(text).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

module.exports = { sendMail, appUrl, escapeHtml, outbox };
