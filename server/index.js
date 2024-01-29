// packages
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// routes
const playerRoute = require("./routes/Player");
const barRoute = require("./routes/Bars");
const tournamentRoute = require("./routes/Tournament");

// express options
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + "/views/"));
app.set("view engine", "ejs");
app.set("trust proxy", 1);

// routes
app.use("/api/Player", playerRoute);
app.use("/api/Bar", barRoute);
app.use("/api/Tournament", tournamentRoute);

// serve index
app.get("/", (req, res) => {
  res.render("index");
});

app.listen(3001, () => {
  console.log("Server on port 3001");
});
