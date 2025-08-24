const { json } = require("body-parser");
const mongoose = require("mongoose");
const moment = require("moment");
mongoose.connect("mongodb://0.0.0.0:27017/VADarts");
const tournamentDB = require("../models/Tournament");

// Helper function to convert YYYY-MM-DD to MM/DD/YYYY
const convertDateFormat = (dateString) => {
  if (!dateString) return dateString;

  console.log(`convertDateFormat input: ${dateString}`);

  // If the date is already in MM/DD/YYYY format, return as is
  if (dateString.includes("/")) {
    console.log(`Date already in MM/DD/YYYY format: ${dateString}`);
    return dateString;
  }

  // Convert from YYYY-MM-DD to MM/DD/YYYY
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.log(`Invalid date: ${dateString}`);
    return dateString; // Invalid date, return original
  }

  // Use native JavaScript instead of moment.js for more reliable formatting
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${month}/${day}/${year}`;

  console.log(`Converted date: ${dateString} -> ${formattedDate}`);
  return formattedDate;
};

// dont look at this it causes me physical pain
const create = async (req, res) => {
  try {
    let nameInput = req.body.Name.toLowerCase();
    delete req.body.Name;
    let barInput = req.body.Bar.toLowerCase();
    delete req.body.Bar;
    let modeInput = req.body.Mode.toLowerCase();
    delete req.body.Mode;
    console.log(`Received date from frontend: ${req.body.Date}`);
    let date = convertDateFormat(req.body.Date);
    console.log(`Converted date for database: ${date}`);
    delete req.body.Date;
    let participants = Number(req.body.Participants);
    delete req.body.Participants;
    let winners = [];
    let playerArray = Object.keys(req.body);
    let winnerLen = playerArray.length / 2;
    let i = 0;
    while (i < winnerLen) {
      let player = req.body["w" + i];
      let pos = req.body["p" + i];
      let points = participants / Number(pos);
      winners.push({ Name: player, Points: points });
      i++;
    }
    await tournamentDB.create({
      Name: nameInput,
      Date: date,
      Bar: barInput,
      Mode: modeInput,
      Winners: winners,
    });
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.redirect(404, "/");
  }
};

const searchBy = async (req, res) => {
  try {
    let conditionCount = req.body.conditionCount;
    let query = {};
    if (conditionCount >= 1) {
      let andQuery = [];
      if (req.body.query.Name !== "") {
        andQuery.push({ Name: req.body.query.Name });
      }
      if (req.body.query.Bar !== "") {
        andQuery.push({ Bar: req.body.query.Bar });
      }
      if (req.body.query.Mode !== "") {
        andQuery.push({ Mode: req.body.query.Mode });
      }
      query = { $and: andQuery };
    }
    let tournamentList = await tournamentDB.find(query, { __v: 0 });
    res.send(tournamentList);
  } catch (e) {
    console.log(e);
    res.redirect(404, "/");
  }
};

const fetchTournament = async (req, res) => {
  try {
    let tournamentID = req.params.id;
    let tournament = await tournamentDB.findById(tournamentID);
    console.log(
      `fetchTournament - sending tournament with date: ${tournament.Date}`
    );
    res.send(tournament);
  } catch (e) {
    console.log(e);
    res.redirect(404, "/");
  }
};

const deleteTournament = async (req, res) => {
  try {
    let tournamentID = req.params.id;
    if (typeof tournamentID != "string") {
      res.send(403, "/");
      return;
    }
    let tournament = await tournamentDB.findByIdAndRemove(tournamentID);
    res.send(tournament);
  } catch (e) {
    console.log(e);
    res.redirect(404, "/");
  }
};

const viewTournaments = async (req, res) => {
  try {
    res.render("tournamentIndex");
  } catch (e) {
    console.log(e);
    res.redirect(404, "/");
  }
};

const viewCreate = async (req, res) => {
  try {
    res.render("newTournament");
  } catch (e) {
    console.log(e);
    res.redirect(404, "/");
  }
};

const editParticipant = async (req, res) => {
  try {
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.redirect(404, "/");
  }
};

const singleTournamentView = async (req, res) => {
  try {
    let tournamentID = req.params.id;
    let tournament = await tournamentDB.findById(tournamentID);
    let winners = {};
    for (let winner in tournament.Winners) {
      let x = JSON.parse(tournament.Winners[winner]);
      winners[x.Name] = x.Points;
    }
    res.render("viewTournament.ejs", {
      tournament: tournament,
      winners: winners,
    });
  } catch (e) {
    console.log(e);
    res.redirect(404, "/tournament");
  }
};

const fetchWinners = async (req, res) => {
  try {
    let tournamentID = req.params.id;
    let tournament = await tournamentDB.findById(tournamentID);
    let winners = {};
    for (let winner in tournament.Winners) {
      let x = JSON.parse(tournament.Winners[winner]);
      winners[x.Name] = x.Points;
    }
    res.send(winners);
  } catch (e) {
    console.log(e);
    res.sendStatus(404);
  }
};

const searchByPlayer = async (req, res) => {
  try {
    let playerName = req.body.playerName;
    let tournamentList = await tournamentDB.find(
      { Winners: { $elemMatch: { Name: playerName } } },
      { __v: 0 }
    );
    res.send(tournamentList);
  } catch (e) {
    console.log(e);
    res.redirect(404, "/");
  }
};

const editWinners = async (req, res) => {
  try {
    let tournamentID = req.body.id;
    let tournament = await tournamentDB.findById(tournamentID);
    delete req.body.id;
    let winners = [];
    let playerArray = Object.keys(req.body);
    let winnerLen = playerArray.length / 2;
    let i = 0;
    while (i < winnerLen) {
      let player = req.body["f" + i];
      let pos = req.body["p" + i];
      winners.push({ Name: player, Points: pos });
      i++;
    }
    tournament.Winners = winners;
    await tournament.save();
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.redirect(404, "/");
  }
};

const editDate = async (req, res) => {
  try {
    let tournamentID = req.body.id;
    let newDate = req.body.date;

    if (!tournamentID || !newDate) {
      res.sendStatus(400);
      return;
    }

    let tournament = await tournamentDB.findById(tournamentID);
    if (!tournament) {
      res.sendStatus(404);
      return;
    }

    console.log(`editDate - received date: ${newDate}`);

    // Since we're now sending MM/DD/YYYY from frontend, validate the format
    // but don't convert if it's already correct
    let finalDate = newDate;

    // Check if it's already in MM/DD/YYYY format
    if (newDate.includes("/")) {
      // Validate the format
      const parts = newDate.split("/");
      if (parts.length === 3) {
        const month = parseInt(parts[0]);
        const day = parseInt(parts[1]);
        const year = parseInt(parts[2]);

        if (
          month >= 1 &&
          month <= 12 &&
          day >= 1 &&
          day <= 31 &&
          year >= 1900
        ) {
          console.log(`editDate - date already in correct format: ${newDate}`);
          finalDate = newDate;
        } else {
          console.log(`editDate - invalid MM/DD/YYYY format, converting...`);
          finalDate = convertDateFormat(newDate);
        }
      } else {
        console.log(`editDate - invalid format, converting...`);
        finalDate = convertDateFormat(newDate);
      }
    } else {
      // Convert from YYYY-MM-DD to MM/DD/YYYY
      console.log(`editDate - converting from YYYY-MM-DD to MM/DD/YYYY`);
      finalDate = convertDateFormat(newDate);
    }

    console.log(`editDate - final date: ${finalDate}`);
    tournament.Date = finalDate;
    await tournament.save();
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};

const removePlayer = async (req, res) => {
  try {
    let tournamentID = req.body.tournamentId;
    let playerIndex = req.body.playerIndex;

    if (!tournamentID || playerIndex === undefined) {
      res.sendStatus(400);
      return;
    }

    let tournament = await tournamentDB.findById(tournamentID);
    if (!tournament) {
      res.sendStatus(404);
      return;
    }

    // Remove the player at the specified index
    if (playerIndex >= 0 && playerIndex < tournament.Winners.length) {
      tournament.Winners.splice(playerIndex, 1);
      await tournament.save();
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};

const addPlayer = async (req, res) => {
  try {
    let tournamentID = req.body.tournamentId;
    let playerId = req.body.playerId;
    let playerPoints = req.body.playerPoints;

    if (!tournamentID || !playerId || playerPoints === undefined) {
      res.sendStatus(400);
      return;
    }

    // Validate that playerId is a valid MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(playerId)) {
      res.status(400).json({ error: "Invalid player ID format" });
      return;
    }

    let tournament = await tournamentDB.findById(tournamentID);
    if (!tournament) {
      res.sendStatus(404);
      return;
    }

    // Get player details from the Player collection first
    const Player = require("../models/Players");
    const player = await Player.findById(playerId);
    if (!player) {
      res.status(400).json({ error: "Player not found" });
      return;
    }

    // Check if player is already in the tournament
    // Handle both cases: winners with _id and winners without _id
    const existingPlayer = tournament.Winners.find(
      (winner) =>
        (winner._id && winner._id.toString() === playerId) ||
        winner.Name === player.FullName
    );
    if (existingPlayer) {
      res.status(400).json({ error: "Player is already in this tournament" });
      return;
    }

    // Add the new player to the winners array
    const newPlayer = {
      _id: playerId,
      Name: player.FullName,
      Points: parseFloat(playerPoints),
    };

    tournament.Winners.push(newPlayer);
    await tournament.save();

    // Return the updated tournament data
    res.json(tournament);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};

module.exports = {
  create,
  searchBy,
  fetchTournament,
  viewTournaments,
  viewCreate,
  singleTournamentView,
  fetchWinners,
  searchByPlayer,
  deleteTournament,
  editWinners,
  editDate,
  removePlayer,
  addPlayer,
};
