const { json } = require("body-parser");
const fs = require("fs");
const { parse } = require("json2csv");
const mongoose = require("mongoose");
mongoose.connect("mongodb://0.0.0.0:27017/VADarts");
const tournamentDB = require("../models/Tournament");
const playerDB = require("../models/Players");
const barDB = require("../models/Bars");
const moment = require("moment");

// This logic is really janky but seems to work. Only really pushing this as its needed as a temporary solution.

const allPoints = async (req, res) => {
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

    tournamentList = await tournamentDB.find({}, { __v: 0 });

    for (i in tournamentList) {
      let barName = tournamentList[i].Bar;
      let winners = tournamentList[i].Winners;
      for (x in winners) {
        let winName = winners[x].Name;
        report[winName][barName] += winners[x].Points;
        report[winName]["Total"] += winners[x].Points;
      }
    }
    for (player in report) {
      if (report[player].Points === 0) {
      } else {
        report[player].Name = player;
        reportList.push(report[player]);
      }
    }
    reportList.sort((a, b) => {
      return b.Total - a.Total;
    });
    res.send(reportList);
  } catch (e) {
    // handle any error
    res.status(500).send(e.message);
  }
};

const allPointsReport = async (req, res) => {
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

    const currentYear = moment().format("YYYY");

    tournamentList = await tournamentDB.find(
      {
        Date: {
          $regex: `${currentYear}$`, // Matches dates that start with current year
        },
      },
      { __v: 0 }
    );

    for (i in tournamentList) {
      let barName = tournamentList[i].Bar;
      let winners = tournamentList[i].Winners;
      for (x in winners) {
        let winName = winners[x].Name;
        report[winName][barName] += winners[x].Points;
        report[winName]["Total"] += winners[x].Points;
      }
    }

    reportList.sort((a, b) => {
      return b.Total - a.Total;
    });

    res.send(report);
  } catch (e) {
    // handle any error
    res.status(500).send(e.message);
  }
};

// Calculates the points and returns a csv

const csvPoints = async (req, res) => {
  try {
    let report = {};
    let bars = [];
    let reportList = [];
    let fieldList = ["Name", "Member", "Total"];
    let barList = await barDB.find({}, { __v: 0 });
    for (i in barList) {
      bars.push(barList[i].Name);
      fieldList.push(barList[i].Name);
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
    for (player in report) {
      report[player].Name = player;
    }

    tournamentList = await tournamentDB.find({}, { __v: 0 });

    for (i in tournamentList) {
      let barName = tournamentList[i].Bar;
      let winners = tournamentList[i].Winners;
      for (x in winners) {
        let winName = winners[x].Name;
        report[winName][barName] += winners[x].Points;
        report[winName]["Total"] += winners[x].Points;
      }
    }

    reportList.sort((a, b) => {
      return b.Total - a.Total;
    });

    const csv = parse(Object.values(report), { fieldList });
    fs.writeFileSync("data.csv", csv, "utf-8");

    res.send(csv);
  } catch (e) {
    // handle any error
    res.status(500).send(e.message);
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
    let fieldList = ["Name", "Member", "Total"];
    let barList = await barDB.find({}, { __v: 0 });
    for (i in barList) {
      bars.push(barList[i].Name);
      fieldList.push(barList[i].Name);
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

    tournamentList = await tournamentDB.find(
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
    } else {
      console.log(tournamentList);
      for (i in tournamentList) {
        let barName = tournamentList[i].Bar;
        let winners = tournamentList[i].Winners;
        for (x in winners) {
          let winName = winners[x].Name;

          // Ensure the player exists in the report object
          if (!report[winName]) {
            console.log(
              `Player ${winName} not found in player list, initializing...`
            );
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
      for (player in report) {
        if (report[player].Total === 0) {
          delete report[player];
        } else {
          report[player].Name = player;
          reportList.push(report[player]);
        }
      }
      if (reportList.length != 0) {
        reportList.sort((a, b) => {
          return b.Total - a.Total;
        });

        const csv = parse(Object.values(report), { fieldList });
        fs.writeFileSync("data.csv", csv, "utf-8");

        res
          .set({
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="points.csv"`,
          })
          .send(csv);
      } else {
        res.status(400).send("No tournaments found for the given date range");
      }
    }
  } catch (e) {
    // handle any error
    console.log(e);
    res.status(500).send(e.message);
  }
};

module.exports = { allPoints, allPointsReport, csvPoints, dateRange };
