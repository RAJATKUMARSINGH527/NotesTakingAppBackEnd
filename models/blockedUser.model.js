const mongoose = require("mongoose");

// A "blocked list" where we save naughty users
const blockedUserSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Save the user ID
});

const BlockedUser = mongoose.model("BlockedUser", blockedUserSchema);

module.exports = {BlockedUser};
