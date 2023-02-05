const express = require('express')
const router = express.Router()
const {
  countStationsByFilter,
  deleteStation,
  readStation,
  readStationsSearchSortPageByPage,
} = require('../controllers/stationController')


router.route('/filter/:stationNimiFilter/:stationOsoiteFilter/').get(countStationsByFilter)
router.route('/pagebypage/:page/:resultsOnPage/:stationNimiFilter/:stationOsoiteFilter/:sortAscending/:sortColumn/').get(readStationsSearchSortPageByPage)

module.exports = router