const dotenv = require("dotenv");

if (process.env.ENVIRONMENT !== "production") {
  const envFound = dotenv.config();
  if (envFound.error) {
    throw new Error("⚠️  Couldn't find .env file");
  }
}

module.exports = {
  connectionString: process.env.CONNECTION_STRING,
  secretForToken: process.env.SECRET_FOR_TOKEN
};