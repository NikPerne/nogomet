const mongoose = require("mongoose");

/**
 * @openapi
 * components:
 *  schemas:
 *   SeasonPayment:
 *    type: object
 *    description: A user's paid season membership fee. A document exists only when paid.
 *    properties:
 *     season:
 *      type: string
 *      description: Season label (October to April).
 *      example: 2026/27
 *     userId:
 *      type: string
 *      description: ID of the user who paid.
 *     paidOn:
 *      type: string
 *      format: date-time
 *      description: When the payment was recorded.
 *    required:
 *     - season
 *     - userId
 *     - paidOn
 */
const seasonPaymentSchema = new mongoose.Schema({
  season: { type: String, required: [true, "Season is required!"] },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required!"],
  },
  paidOn: { type: Date, default: Date.now },
});

seasonPaymentSchema.index({ season: 1, userId: 1 }, { unique: true });

mongoose.model("SeasonPayment", seasonPaymentSchema, "SeasonPayments");
