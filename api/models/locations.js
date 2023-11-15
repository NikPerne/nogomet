const mongoose = require("mongoose");

/**
 * @openapi
 * components:
 *  schemas:
 *   Comment:
 *    type: object
 *    description: Comment about cultural heritage location.
 *    properties:
 *     _id:
 *      type: string
 *      description: <b>unique identifier</b> of comment
 *      example: 635a62f5dc5d7968e68464be
 *     author:
 *      type: string
 *      description: <b>name of the author</b> of the comment
 *      example: Dejan Lavbič
 *     rating:
 *      type: integer
 *      description: <b>rating</b> of the location
 *      minimum: 0
 *      maximum: 5
 *      example: 5
 *     comment:
 *      type: string
 *      description: <b>comment</b> about the location
 *      example: Interesting location with only few tourists.
 *     createdOn:
 *      type: string
 *      description: <b>date</b> of the comment <b>creation</b>
 *      format: date-time
 *      example: 2020-12-25T17:43:00.000Z
 *    required:
 *     - _id
 *     - author
 *     - rating
 *     - comment
 *     - createdOn
 */
const commentSchema = new mongoose.Schema({
  author: { type: String, required: [true, "Author is required!"] },
  rating: {
    type: Number,
    required: [true, "Rating is required!"],
    min: 0,
    max: 5,
  },
  comment: { type: String, required: [true, "Comment is required!"] },
  createdOn: { type: Date, default: Date.now },
});

/**
 * @openapi
 * components:
 *  schemas:
 *   Location:
 *    type: object
 *    description: Cultural heritage <b>location</b>.
 *    properties:
 *     _id:
 *      type: string
 *      description: unique identifier
 *     name:
 *      type: string
 *      description: name of the location
 *     category:
 *      type: string
 *      description: category of the location
 *     type:
 *      type: string
 *      description: type of the location
 *     keywords:
 *      type: array
 *      description: keywords describing the location
 *      items:
 *       type: string
 *      minItems: 1
 *     description:
 *      type: string
 *      description: description of the location
 *     location:
 *      type: string
 *      description: textual description of actual location
 *     institution:
 *      type: string
 *      description: institution responsible for the location
 *     heritage:
 *      type: string
 *      description: heritage of the location
 *     municipality:
 *      type: string
 *      description: municipality of the location
 *     coordinates:
 *      type: array
 *      items:
 *       type: number
 *      minItems: 2
 *      maxItems: 2
 *      description: GPS coordinates of the location
 *     synonyms:
 *      type: array
 *      items:
 *       type: string
 *      description: synonyms of the location
 *      minItems: 1
 *     datation:
 *      type: string
 *      description: datation of the location
 *     authors:
 *      type: string
 *      description: authors of the cultural heritage
 *     fields:
 *      type: array
 *      items:
 *       type: string
 *      description: fields of the cultural heritage
 *      minItems: 1
 *     distance:
 *      type: number
 *      description: distance from the given location
 *      minimum: 0
 *     rating:
 *      type: integer
 *      description: average rating of the location
 *      minimum: 0
 *      maximum: 5
 *     comments:
 *      type: array
 *      items:
 *       $ref: '#/components/schemas/Comment'
 *    required:
 *     - _id
 *     - name
 *     - category
 *     - type
 *     - keywords
 *     - description
 *     - location
 *     - institution
 *     - heritage
 *     - municipality
 *     - coordinates
 *     - fields
 */
const locationSchema = mongoose.Schema({
  id: {
    type: Number,
    required: [true, "Unique identifier is required!"],
  },
  name: { type: String, required: [true, "Name is required!"] },
  synonyms: {
    type: [String],
    validate: {
      validator: (v) => v == undefined || (Array.isArray(v) && v.length > 0),
      message: "If synonyms are provided, they must be an array of strings!",
    },
  },
  category: { type: String, required: [true, "Category is required!"] },
  type: { type: String, required: [true, "Type is required!"] },
  keywords: {
    type: [String],
    validate: {
      validator: (v) => Array.isArray(v) && v.length > 0,
      message: "At least one keyword is required!",
    },
  },
  description: {
    type: String,
    required: [true, "Description is required!"],
  },
  datation: { type: String, required: false },
  authors: { type: String, required: false },
  location: {
    type: String,
    required: [true, "Location description is required!"],
  },
  fields: {
    type: [String],
    validate: {
      validator: (v) => Array.isArray(v) && v.length > 0,
      message: "At least one field is required!",
    },
  },
  institution: { type: String, required: [true, "Institution is required!"] },
  heritage: { type: String, required: [true, "Heritage is required!"] },
  municipality: { type: String, required: [true, "Municipality is required!"] },
  coordinates: {
    type: [Number],
    validate: {
      validator: (v) => Array.isArray(v) && v.length == 2,
      message: "Coordinates must be an array of two numbers!",
    },
    index: "2dsphere",
  },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  comments: {
    type: [commentSchema],
  },
});

mongoose.model("Location", locationSchema, "Locations");
