/**
 * Load environment variables
 */
require("dotenv").config();

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
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
    ],
    servers: [
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
        Codelist: {
          type: "string",
          description:
            "Allowed values for the codelist used in events.",
          enum: [
            "name",
            "description",
            "date",
            "signups",
          ],
        },
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
  apis: ["./api/models/*.js", "./api/controllers/*.js"],
});

/**
 * Database connection
 */
require("./api/models/db.js");
require("./api/config/passport");

const apiRouter = require("./api/routes/api");

/**
 * Create server
 */
const port = process.env.PORT || 3000;
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
 * Body parser (application/x-www-form-urlencoded)
 */
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * API routing
 */
app.use("/api", apiRouter);

/**
 * Angular routing
 */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "angular", "build", "index.html"));
});

/**
 * Swagger file and explorer
 */
apiRouter.get("/swagger.json", (req, res) =>
  res.status(200).json(swaggerDocument)
);
apiRouter.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCss: ".swagger-ui .topbar { display: none }",
  })
);

/**
 * Authorization error handler
 */
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError")
    res.status(401).json({ message: err.message });
});

/**
 * Start server
 */
if (process.env.HTTPS == "true") {
  const fs = require("fs");
  const https = require("https");
  https
    .createServer(
      {
        key: fs.readFileSync("/etc/secrets/server.key"),
        cert: fs.readFileSync("/etc/secrets/server.cert"),
      },
      app
    )
    .listen(port, () => {
      console.log(
        `Secure demo app started in '${
          process.env.NODE_ENV || "development"
        } mode' listening on port ${port}!`
      );
    });
} else {
  app.listen(port, () => {
    console.log(
      `Demo app started in ${
        process.env.NODE_ENV || "development"
      } mode listening on port ${port}!`
    );
  });
}
