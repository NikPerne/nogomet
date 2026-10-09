/**
 * Load environment variables
 */
require("dotenv").config();

/**
 * Database connection, then the app (app.js)
 */
const { connect } = require("./api/models/db.js");
connect().catch((err) => {
  console.error(`Could not connect to the database: ${err.message}`);
  process.exit(1);
});

const app = require("./app");

/**
 * Start server
 */
const port = process.env.PORT || 3000;

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
