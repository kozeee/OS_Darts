const mongoose = require("mongoose");
mongoose.connect("mongodb://0.0.0.0:27017/VADarts");
const barDB = require("../models/Bars");
const tournamentDB = require("../models/Tournament");

const create = async (req, res) => {
  try {
    let nameInput = req.body.Name.toLowerCase();
    let checkbar = await exists(nameInput);
    if (checkbar == false) {
      res.sendStatus(403);
    } else {
      await barDB.create({
        Name: nameInput,
      });
      res.sendStatus(200);
    }
  } catch (e) {
    console.log(e);
    res.redirect(404, "/");
  }
};

const getAll = async (req, res) => {
  try {
    console.log("BarController.getAll called");
    let barList = await barDB.find({}, { _id: 0, __v: 0 });
    console.log("Raw barList from DB:", barList);
    console.log("barList length:", barList.length);

    let returnList = [];
    for (let bar of barList) {
      returnList.push(bar);
    }
    console.log("Final returnList:", returnList);
    console.log("returnList length:", returnList.length);

    res.send(returnList);
  } catch (e) {
    console.log("Error in BarController.getAll:", e);
    res.redirect(404, "/");
  }
};

const exists = async (name) => {
  try {
    const bar = await barDB.findOne({ Name: name });
    if (bar === null) return true;
    else {
      return false;
    }
  } catch (e) {
    console.log(e);
  }
};

const populateBars = async (req, res) => {
  try {
    // Get all tournaments to extract unique bar names
    const tournaments = await tournamentDB.find({}, { Bar: 1 });

    // Extract unique bar names
    const uniqueBarNames = [...new Set(tournaments.map((t) => t.Bar))];

    let addedCount = 0;
    let existingCount = 0;

    // Add each unique bar name to the Bars collection
    for (const barName of uniqueBarNames) {
      if (barName) {
        // Skip empty names
        const existingBar = await barDB.findOne({ Name: barName });
        if (!existingBar) {
          await barDB.create({ Name: barName });
          addedCount++;
        } else {
          existingCount++;
        }
      }
    }

    res.json({
      message: `Bars populated successfully`,
      added: addedCount,
      existing: existingCount,
      total: uniqueBarNames.length,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
};

module.exports = {
  create,
  getAll,
  populateBars,
};
