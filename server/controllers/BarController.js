const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/VADarts");
const barDB = require("../models/Bars");

const create = async (req, res) => {
    try {
      let nameInput = req.body.Name.toLowerCase()
      let checkbar = await exists(nameInput)
      if (checkbar == false){
          res.sendStatus(403)
      }
      else{
          await barDB.create({
          Name: nameInput
        });
        res.sendStatus(200)}
    } catch (e) {
      console.log(e);
      res.redirect(404, "/");
    }
  };
  
  const getAll = async (req, res) => {
    try {
      let barList = await barDB.find({},{_id:0,__v:0});
      let returnList = []
      for (let bar of barList) {
          returnList.push(bar);
      }
      res.send(returnList)
    } catch (e) {
      console.log(e);
      res.redirect(404, "/");
    }
  };

const exists = async (name) => {
    try {
      const bar = await barDB.findOne({ Name: name });
      if (bar === null) return true
      else {
        return false
      }
    } catch (e) {
      console.log(e);
    }
  };

module.exports = {
    create,
    getAll,
  };
  