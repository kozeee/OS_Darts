const mongoose = require("mongoose");
const moment = require("moment");

const tournamentSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Mode: {
    type: String,
    required: true,
    default: "singles",
  },
  Bar: {
    type: String,
    required: true,
  },
  Date: {
    type: String,
    required: true,
    default: () => moment(Date.now()).format("MM/DD/YYYY"),
  },
  Winners: {
    type: [
      {
        Name: String,
        Points: Number,
      },
    ],
    default: [],
  },
});

module.exports = mongoose.model("Tournaments", tournamentSchema);
