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

const sendMail = async ({ to, toName, subject, text, html }) => {
  const { BREVO_API_KEY, MAIL_FROM, MAIL_FROM_NAME } = process.env;
  if (!BREVO_API_KEY || !MAIL_FROM) {
    if (isProduction())
      throw new Error("Email is not configured (BREVO_API_KEY and MAIL_FROM).");
    console.log(`[mail] Not configured, printing instead.\nTo: ${to}\nSubject: ${subject}\n${text}`);
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

module.exports = { sendMail, appUrl };
