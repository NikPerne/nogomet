const mongoose = require("mongoose");
const Event = mongoose.model("Event");
const { playerKeyOf } = require("../models/events");
const { isValidId, isOwnSignup } = require("./helpers");

const eventNotFound = (res, eventId) =>
  res.status(404).json({ message: `Event with id '${eventId}' not found.` });

const isPlayerOf = (event, user) =>
  event.confirmedSignups().some((signup) => isOwnSignup(signup, user));

const ownVote = (event, user) =>
  (event.mvpVotes ?? []).find((vote) => vote.voterId.equals(user._id))?.playerKey ?? null;

const voteStatus = (event, user) => ({
  canVote: event.isMvpVotingOpen() && isPlayerOf(event, user),
  votingOpen: event.isMvpVotingOpen(),
  myVote: ownVote(event, user),
});

/**
 * @openapi
 * /events/{eventId}/mvp:
 *   get:
 *     summary: The current user's player-of-the-match vote status
 *     description: The tally is public (mvpTally on the event); who voted for whom is not.
 *     tags: [Teams]
 *     security:
 *      - jwt: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: canVote, votingOpen and myVote (player key or null)
 *       '401':
 *         description: Not authenticated
 *       '404':
 *         description: Event not found
 *   put:
 *     summary: Vote for the player of the match (or change the vote)
 *     description: >
 *       Only confirmed players of the match can vote, not for themselves, from kick-off until
 *       a week later. Candidates are confirmed players (guests included), identified by
 *       player key: the userId, or "guest:<name>" / "name:<name>".
 *     tags: [Teams]
 *     security:
 *      - jwt: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               playerKey:
 *                 type: string
 *             required:
 *               - playerKey
 *     responses:
 *       '200':
 *         description: event (with the updated mvpTally) and the vote status
 *       '400':
 *         description: Unknown candidate, or voting for yourself
 *       '401':
 *         description: Not authenticated
 *       '403':
 *         description: Only players of this match can vote
 *       '404':
 *         description: Event not found
 *       '409':
 *         description: Voting is not open
 */
const voteStatusHandler = async (req, res) => {
  const { eventId } = req.params;
  if (!isValidId(eventId)) return eventNotFound(res, eventId);
  try {
    const event = await Event.findById(eventId).exec();
    if (!event) return eventNotFound(res, eventId);
    res.status(200).json(voteStatus(event, req.user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const vote = async (req, res) => {
  const { eventId } = req.params;
  const playerKey = typeof req.body.playerKey === "string" ? req.body.playerKey : "";
  if (!playerKey)
    return res.status(400).json({ message: "Body parameter 'playerKey' is required." });
  if (!isValidId(eventId)) return eventNotFound(res, eventId);
  try {
    const event = await Event.findById(eventId).exec();
    if (!event) return eventNotFound(res, eventId);
    if (!event.isMvpVotingOpen())
      return res.status(409).json({
        message: "Voting opens at kick-off and closes a week later.",
      });
    if (!isPlayerOf(event, req.user))
      return res.status(403).json({ message: "Only players of this match can vote." });
    const candidate = event
      .confirmedSignups()
      .find((signup) => playerKeyOf(signup) === playerKey);
    if (!candidate)
      return res.status(400).json({ message: "That player didn't play in this match." });
    if (isOwnSignup(candidate, req.user))
      return res.status(400).json({ message: "You can't vote for yourself." });

    // One vote per voter: a new vote replaces the old one
    event.mvpVotes = [
      ...(event.mvpVotes ?? []).filter((v) => !v.voterId.equals(req.user._id)),
      { voterId: req.user._id, playerKey, playerName: candidate.name },
    ];
    await event.save();
    res.status(200).json({ event, ...voteStatus(event, req.user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { voteStatus: voteStatusHandler, vote };
