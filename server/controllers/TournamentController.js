const { json } = require("body-parser");
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/VADarts");
const tournamentDB = require("../models/Tournament");

// dont look at this it causes me physical pain
const create = async (req, res) => {
  try {
    let nameInput = req.body.Name.toLowerCase();
    delete req.body.Name;
    let barInput = req.body.Bar.toLowerCase();
    delete req.body.Bar;
    let modeInput = req.body.Mode.toLowerCase();
    delete req.body.Mode;
    let date = req.body.Date;
    delete req.body.Date;
    let participants = parseInt(req.body.Participants);
    delete req.body.Participants;
    let winners = [];
    let playerArray = Object.keys(req.body);
    let winnerLen = playerArray.length / 2;
    let i = 0;
    while (i < winnerLen) {
      let player = req.body["w" + i];
      let pos = req.body["p" + i];
      let points = participants / parseInt(pos);
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

const displayID = async (req, res) => {
  try {
    let tournamentID = req.params.id;
    let tournament = await tournamentDB.findById(tournamentID);
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

module.exports = {
  create,
  searchBy,
  displayID,
  viewTournaments,
  viewCreate,
  singleTournamentView,
  fetchWinners,
  searchByPlayer,
};
