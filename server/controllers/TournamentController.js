const { json } = require("body-parser");
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/VADarts");
const tournamentDB = require("../models/Tournament");

const create = async (req, res) => {
  try {
    let nameInput = req.body.Name.toLowerCase();
    let barInput = req.body.Bar.toLowerCase();
    let modeInput = req.body.Mode.toLowerCase();
    let date = req.body.Date;
    let participants = req.body.Participants;
    await tournamentDB.create({
      Name: nameInput,
      Date: date,
      Bar: barInput,
      Mode: modeInput,
      Participants: null,
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
    if (conditionCount < 1 || conditionCount == null) {
      let tournamentList = await tournamentDB.find({}, { __v: 0 });
      let returnList = [];
      for (let tournament of tournamentList) {
        returnList.push(tournament);
      }
      res.send(returnList);
    } else {
      let query = req.body.query;
      if (query.Name === "") {
        delete query["Name"];
      }
      if (query.Bar === "") {
        delete query["Bar"];
      }
      if (query.Mode === "") {
        delete query["Mode"];
      }
      let tournamentList = await tournamentDB.find(query, { __v: 0 });
      let returnList = [];
      for (let tournament of tournamentList) {
        returnList.push(tournament);
      }
      res.send(returnList);
    }
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

module.exports = {
  create,
  searchBy,
  displayID,
  viewTournaments,
  viewCreate,
  singleTournamentView,
  fetchWinners,
};
