const express = require('express')
const router = express.Router()
const {
  createStation,
  deleteStation,
  readAllStations,
  readStation,
  readStationsPageByPage,
} = require('../controllers/stationController')

router.route('/').get(readAllStations).post(createStation)
router.route('/:id').get(readStation).delete(deleteStation)
router.route('/pagebypage/:page/:sortParam/:startWith/').get(readStationsPageByPage)

module.exports = router