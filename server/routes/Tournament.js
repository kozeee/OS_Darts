const { Router } = require('express')
const express = require('express')
const router = express.Router()
const controller = require("../controllers/TournamentController");

router.post('/create',controller.create)
router.get('/create', controller.viewCreate)

router.post('/search', controller.searchBy)
router.get('/',controller.viewTournaments)

router.get('/view/:id',controller.singleTournamentView)
router.post('/view/:id',controller.displayID)

router.get('/winners/:id',controller.fetchWinners)



module.exports = router ;