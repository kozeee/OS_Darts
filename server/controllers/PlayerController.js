const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/VADarts");
const playerDB = require("../models/Players");

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

module.exports = {
  signUp,
  getAll,
  modifyMembership,
};
