const mongoose = require("mongoose");

// A "blacklist" where we save bad keys
const blacklistedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  }, // Save the "key"

  createdAt: {
    type: Date,
    default: Date.now,
    expires: "1d",
  }, // Automatically delete the key after 1 day
});

const BlacklistedToken = mongoose.model(
  "BlacklistedToken",
  blacklistedTokenSchema
);

module.exports = {BlacklistedToken};
