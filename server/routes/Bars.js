const { Router } = require('express')
const express = require('express')
const router = express.Router()
const controller = require("../controllers/BarController");

router.post('/create',controller.create)
router.get('/all', controller.getAll)
router.post('/populate', controller.populateBars)

module.exports = router ;