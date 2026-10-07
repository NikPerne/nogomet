const express = require("express");
const router = express.Router();
const { auth, adminOnly } = require("../middleware/auth");
const ctrlEvents = require("../controllers/events");
const ctrlSignup = require("../controllers/signup");
const ctrlUsers = require("../controllers/users");
const ctrlAuthentication = require("../controllers/authentication");

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
  .put(adminOnly, ctrlEvents.updateEvent);

/**
 * Signups
 */
router.post("/events/:eventId/signups", auth, ctrlSignup.signupCreate);
router
  .route("/events/:eventId/signups/:signupId")
  .get(ctrlSignup.signupReadOne)
  .delete(auth, ctrlSignup.signupDeleteOne);

/**
 * Authentication
 */
router.post("/register", ctrlAuthentication.register);
router.post("/login", ctrlAuthentication.login);

module.exports = router;
