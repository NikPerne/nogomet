const express = require("express");
const router = express.Router();
const { auth, adminOnly } = require("../middleware/auth");
const ctrlEvents = require("../controllers/events");
const ctrlSignup = require("../controllers/signup");
const ctrlUsers = require("../controllers/users");
const ctrlAuthentication = require("../controllers/authentication");
const ctrlSeason = require("../controllers/season");
const ctrlTeams = require("../controllers/teams");
const ctrlMvp = require("../controllers/mvp");
const ctrlAccount = require("../controllers/account");
const ctrlAdmin = require("../controllers/admin");
const ctrlCron = require("../controllers/cron");

/**
 * Users
 */
router.get("/users", ctrlUsers.userList);

/**
 * Events
 */
router
  .route("/events")
  .get(ctrlEvents.eventsList)
  .post(adminOnly, ctrlEvents.createEvent);
router
  .route("/events/:eventId")
  .get(ctrlEvents.eventsReadOne)
  .put(adminOnly, ctrlEvents.updateEvent)
  .delete(adminOnly, ctrlEvents.deleteEvent);

/**
 * Signups
 */
router.post("/events/:eventId/signups", auth, ctrlSignup.signupCreate);
router
  .route("/events/:eventId/signups/:signupId")
  .get(ctrlSignup.signupReadOne)
  .put(auth, ctrlSignup.signupUpdateOne)
  .delete(auth, ctrlSignup.signupDeleteOne);
router.post("/events/:eventId/guests", auth, ctrlSignup.guestCreate);

/**
 * Teams and score
 */
router
  .route("/events/:eventId/teams")
  .put(adminOnly, ctrlTeams.saveTeams)
  .delete(adminOnly, ctrlTeams.clearTeams);
router
  .route("/events/:eventId/score")
  .put(adminOnly, ctrlTeams.saveScore)
  .delete(adminOnly, ctrlTeams.clearScore);
router
  .route("/events/:eventId/mvp")
  .get(auth, ctrlMvp.voteStatus)
  .put(auth, ctrlMvp.vote);

/**
 * Scheduled jobs (called by an external scheduler with CRON_SECRET)
 */
router.post("/cron/reminders", ctrlCron.runReminders);

/**
 * User administration
 */
router.get("/admin/users", adminOnly, ctrlAdmin.listUsers);
router
  .route("/admin/users/:userId")
  .put(adminOnly, ctrlAdmin.setAdmin)
  .delete(adminOnly, ctrlAdmin.deleteUser);

/**
 * Season membership fees
 */
router.get("/season", auth, ctrlSeason.seasonOverview);
router.put("/season/payments/:userId", adminOnly, ctrlSeason.setPayment);

/**
 * Authentication
 */
router.post("/register", ctrlAuthentication.register);
router.post("/login", ctrlAuthentication.login);
router.get("/me", auth, ctrlAccount.me);
router.put("/me/settings", auth, ctrlAccount.updateSettings);
router.put("/me/password", auth, ctrlAuthentication.changePassword);
router.post("/password/forgot", ctrlAuthentication.forgotPassword);
router.post("/password/reset", ctrlAuthentication.resetPassword);

module.exports = router;
