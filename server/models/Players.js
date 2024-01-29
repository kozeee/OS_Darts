const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  FullName: {
    type: String,
    required: true,
    unique: true,
  },
  Membership: {
    type: Boolean,
    required: false,
    default: false,
  },
});

module.exports = mongoose.model("Players", playerSchema);
