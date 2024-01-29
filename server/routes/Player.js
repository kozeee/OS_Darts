const { Router } = require('express')
const express = require('express')
const router = express.Router()
const controller = require("../controllers/PlayerController");

router.post('/create',controller.signUp)
router.get('/all', controller.getAll)


module.exports = router ;