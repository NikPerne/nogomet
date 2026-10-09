/**
 * The Express application (no database connection, no listening), so tests can use it
 * directly. server.js connects to the database and starts it.
 */
const express = require("express");
const path = require("path");
const passport = require("passport");
const cors = require("cors");

/**
 * Swagger and OpenAPI
 */
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = swaggerJsDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Nogomet",
      version: "0.1.0",
      description:
        "Nogomet **REST API** used for [DevOps academy - Web development](https://teaching.lavbic.net/DevOps/WebDev/backend) course at [Faculty of Computer and Information Science](https://www.fri.uni-lj.si/en), [University of Ljubljana](https://www.uni-lj.si/eng) given by [Associate Professor Dejan Lavbič](https://www.lavbic.net)!\n\nThe application supports:\n* **Adding** events,\n* **adding signups** to existing events,\n* and more.",
    },
    tags: [
      {
        name: "Events",
        description: "Events for football recreation",
      },
      {
        name: "Signups",
        description: "User signups for events.",
      },
      {
        name: "Authentication",
        description: "<b>User management</b> and authentication.",
      },
      {
        name: "Teams",
        description: "Saved teams (Rumeni / Rdeči) and match score.",
      },
      {
        name: "Admin",
        description: "User administration (administrators only).",
      },
      {
        name: "Season",
        description: "Season membership fees (October to April).",
      },
    ],
    servers: [
      {
        url: "/api",
        description: "This server (the one serving these docs)",
      },
      {
        url: "https://localhost:3000/api",
        description: "Secure development server for testing",
      },
      {
        url: "https://host.docker.internal:3000/api",
        description: "Development server for testing",
      },
      {
        url: "https://nogomet.onrender.com/api",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        jwt: {
          type: "http",
          scheme: "bearer",
          in: "header",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ErrorMessage: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Message describing the error.",
            },
          },
          required: ["message"],
        },
      },
    },
  },
  apis: [
    path.join(__dirname, "api", "models", "*.js"),
    path.join(__dirname, "api", "controllers", "*.js"),
  ],
});

/**
 * Models and authentication (routes need both)
 */
require("./api/models");
require("./api/config/passport");

const apiRouter = require("./api/routes/api");

const app = express();

/**
 * CORS
 */
app.use(cors());

/**
 * Static pages
 */
app.use(express.static(path.join(__dirname, "angular", "build")));

/**
 * Passport
 */
app.use(passport.initialize());

/**
 * Body parsers (application/x-www-form-urlencoded and application/json)
 */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/**
 * Swagger file and explorer
 */
app.get("/api/swagger.json", (req, res) =>
  res.status(200).json(swaggerDocument)
);
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCss: ".swagger-ui .topbar { display: none }",
  })
);

/**
 * API routing
 */
app.use("/api", apiRouter);

/**
 * Unknown API routes return JSON instead of the Angular app
 */
app.use("/api", (req, res) =>
  res.status(404).json({ message: `Route '${req.originalUrl}' not found.` })
);

/**
 * Angular routing
 */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "angular", "build", "index.html"));
});

/**
 * Error handler
 */
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError")
    return res.status(401).json({ message: err.message });
  console.error(err);
  res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;
