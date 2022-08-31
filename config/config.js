const dotenv = require("dotenv");

if (process.env.NODE_ENV !== "Production") {
  const envFound = dotenv.config();
  if (envFound.error) {
    throw new Error("⚠️  Couldn't find .env file");
  }
}

module.exports = {
  connectionString: process.env.CONNECTION_STRING,
  secretForToken: process.env.SECRET_FOR_TOKEN,
  port: process.env.PORT
};