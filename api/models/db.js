const mongoose = require("mongoose");
require("./index");

/**
 * MONGODB_URI overrides everything (e.g. tests); otherwise NODE_ENV decides:
 * production -> MONGODB_ATLAS_URI, test (Docker) -> web-dev-mongo-db, else local MongoDB
 */
const databaseUri = () => {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;
  if (process.env.NODE_ENV === "production") return process.env.MONGODB_ATLAS_URI;
  if (process.env.NODE_ENV === "test") return "mongodb://web-dev-mongo-db/Demo";
  return "mongodb://127.0.0.1/Demo";
};

const gracefulShutdown = async (msg, callback) => {
  await mongoose.connection.close();
  console.log(`Mongoose disconnected through ${msg}.`);
  callback();
};

/**
 * Connects to the database and closes the connection cleanly when the process stops
 */
const connect = () => {
  const dbURI = databaseUri();
  mongoose.connection.on("connected", () =>
    console.log(`Mongoose connected to ${dbURI.replace(/:.+?@/, ":*****@")}.`)
  );
  mongoose.connection.on("error", (err) =>
    console.log(`Mongoose connection error: ${err}.`)
  );
  mongoose.connection.on("disconnected", () => console.log("Mongoose disconnected"));

  process.once("SIGUSR2", () => {
    gracefulShutdown("nodemon restart", () => process.kill(process.pid, "SIGUSR2"));
  });
  process.on("SIGINT", () => {
    gracefulShutdown("app termination", () => process.exit(0));
  });
  process.on("SIGTERM", () => {
    gracefulShutdown("Cloud-based app shutdown", () => process.exit(0));
  });

  return mongoose.connect(dbURI);
};

module.exports = { connect };
