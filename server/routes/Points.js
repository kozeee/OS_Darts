const { Router } = require("express");
const express = require("express");
const router = express.Router();
const controller = require("../controllers/PointsController");

router.get("/all", controller.allPoints);

module.exports = router;
