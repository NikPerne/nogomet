const express = require("express");
const router = express.Router();
const { expressjwt: jwt } = require("express-jwt");
const auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: "payload",
  algorithms: ["HS256"],
});
const ctrlLocations = require("../controllers/locations");
const ctrlComments = require("../controllers/comments");
const ctrlEvents = require("../controllers/events");
const ctrlSignup = require("../controllers/signup");
const ctrlAuthentication = require("../controllers/authentication");

/**
 * Locations
 */
router.get("/locations/distance", ctrlLocations.locationsListByDistance);
router.get("/locations/search", ctrlLocations.locationsListByMultiFilter);
router.get(
  "/locations/codelist/:codelist",
  ctrlLocations.locationsListCodelist
);
router.get("/locations/:locationId", ctrlLocations.locationsReadOne);

/**
 * events
 */
router.get("/events", ctrlEvents.eventsList);
router.get("/events/:eventId", ctrlEvents.eventsReadOne);
router.post(
  "/events/:eventId/signups",
  auth,
  ctrlSignup.signup
);
router.post("/events", auth, ctrlEvents.createEvent);

/**
 * Comments
 */
router.post(
  "/locations/:locationId/comments",
  auth,
  ctrlComments.commentsCreate
);
router
  .route("/locations/:locationId/comments/:commentId")
  .get(ctrlComments.commentsReadOne)
  .put(auth, ctrlComments.commentsUpdateOne)
  .delete(auth, ctrlComments.commentsDeleteOne);

/**
 * Authentication
 */
router.post("/register", ctrlAuthentication.register);
router.post("/login", ctrlAuthentication.login);

module.exports = router;
