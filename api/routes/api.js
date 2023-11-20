const express = require("express");
const router = express.Router();
const { expressjwt: jwt } = require("express-jwt");
const auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: "payload",
  algorithms: ["HS256"],
});
const ctrlEvents = require("../controllers/events");
const ctrlSignup = require("../controllers/signup");
const ctrlUsers = require("../controllers/users");
const ctrlAuthentication = require("../controllers/authentication");

/**
 * users
 */
router.get("/users", ctrlUsers.userList);

/**
 * events
 */
router.get("/events", ctrlEvents.eventsList);
router.get("/events/:eventId", ctrlEvents.eventsReadOne);
router.post("/events/:eventId/signups", auth, ctrlSignup.signupCreate);
router
  .route("/events/:eventId/signups/:signupId")
  .get(ctrlSignup.SignUpReadOne)
  .delete(auth, ctrlSignup.signUpDeleteOne);
router.post("/events", auth, ctrlEvents.createEvent);


/**
 * Authentication
 */
router.post("/register", ctrlAuthentication.register);
router.post("/login", ctrlAuthentication.login);

module.exports = router;
