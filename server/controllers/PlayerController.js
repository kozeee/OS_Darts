const mongoose = require("mongoose");
mongoose.connect("mongodb://0.0.0.0:27017/VADarts");
const playerDB = require("../models/Players");
const tournamentDB = require("../models/Tournament");
const barDB = require("../models/Bars");

const signUp = async (req, res) => {
  let Membership = false;
  try {
    if (req.body.Membership === "on") {
      Membership = true;
    }
    let nameInput = req.body.Name.toLowerCase();
    let checkPlayer = await exists(nameInput);
    if (checkPlayer == false) {
      res.sendStatus(403);
    } else {
      await playerDB.create({
        FullName: nameInput,
        Membership: Membership,
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
    let playerList = await playerDB.find({}, { __v: 0 });
    let returnList = [];
    for (let player of playerList) {
      returnList.push(player);
    }
    res.send(returnList);
  } catch (e) {
    console.log(e);
    res.redirect(404, "/");
  }
};

const exists = async (name) => {
  try {
    const player = await playerDB.findOne({ FullName: name });
    if (player === null) return true;
    else {
      return false;
    }
  } catch (e) {
    console.log(e);
  }
};

const modifyMembership = async (req, res) => {
  try {
    let name = req.body.Name.toLowerCase();
    const player = await playerDB.findOne({ FullName: name });
    if (player === null) res.sendStatus(404);
    console.log(player.Membership);
    player.Membership = !player.Membership;
    await player.save();
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
  }
};

const dateRange = async (req, res) => {
  let { startDate, endDate } = req.body;

  startDate = new Date(startDate);
  endDate = new Date(endDate);

  try {
    let report = {};
    let bars = [];
    let reportList = [];
    let barList = await barDB.find({}, { __v: 0 });

    for (i in barList) {
      bars.push(barList[i].Name);
    }

    let playerList = await playerDB.find({}, { __v: 0 });
    for (i in playerList) {
      let name = playerList[i].FullName;
      let membership = "no";
      if (playerList[i].Membership == true) {
        membership = "yes";
      }

      report[name] = { Member: membership, Total: 0 };
      for (x in bars) {
        report[name][bars[x]] = 0;
      }
    }

    // Filter tournaments by date range
    let tournamentList = await tournamentDB.find(
      {
        $expr: {
          $and: [
            {
              $gte: [
                {
                  $cond: {
                    if: { $regexMatch: { input: "$Date", regex: "^\\d{4}-" } },
                    then: {
                      $dateFromString: {
                        dateString: "$Date",
                        format: "%Y-%m-%d",
                      },
                    },
                    else: {
                      $dateFromString: {
                        dateString: "$Date",
                        format: "%m/%d/%Y",
                      },
                    },
                  },
                },
                startDate,
              ],
            },
            {
              $lte: [
                {
                  $cond: {
                    if: { $regexMatch: { input: "$Date", regex: "^\\d{4}-" } },
                    then: {
                      $dateFromString: {
                        dateString: "$Date",
                        format: "%Y-%m-%d",
                      },
                    },
                    else: {
                      $dateFromString: {
                        dateString: "$Date",
                        format: "%m/%d/%Y",
                      },
                    },
                  },
                },
                endDate,
              ],
            },
          ],
        },
      },
      { __v: 0 }
    );

    if (tournamentList.length === 0) {
      res.status(400).send("No tournaments found for the given date range");
      return;
    }

    // Calculate points for the date range
    for (i in tournamentList) {
      let barName = tournamentList[i].Bar;
      let winners = tournamentList[i].Winners;
      for (x in winners) {
        let winName = winners[x].Name;

        // Ensure the player exists in the report object
        if (!report[winName]) {
          report[winName] = { Member: "no", Total: 0 };
          // Initialize all bar fields for this player
          for (let bar of bars) {
            report[winName][bar] = 0;
          }
        }

        // Ensure the bar exists in the player's record
        if (!report[winName][barName]) {
          report[winName][barName] = 0;
        }

        report[winName][barName] += winners[x].Points;
        report[winName]["Total"] += winners[x].Points;
      }
    }

    // Convert to array and sort by total points
    for (player in report) {
      if (report[player].Total === 0) {
        delete report[player];
      } else {
        report[player].Name = player;
        reportList.push(report[player]);
      }
    }

    if (reportList.length !== 0) {
      reportList.sort((a, b) => {
        return b.Total - a.Total;
      });
    }

    res.json(reportList);
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
};

module.exports = {
  signUp,
  getAll,
  modifyMembership,
  dateRange,
};
