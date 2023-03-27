const express = require('express')
const router = express.Router()
const {
  createStation,
  deleteStation,
  countStationsByFilter,
  readStation,
  readStationsSearchSortPageByPage,
} = require('../controllers/stationController')

router.route('/').post(createStation)
router.route('/:id').get(readStation).delete(deleteStation)
router.route('/filter/:stationNimiFilter/:stationOsoiteFilter/').get(countStationsByFilter)
router.route('/pagebypage/:page/:resultsOnPage/:stationNimiFilter/:stationOsoiteFilter/:sortAscending/:sortColumn/').get(readStationsSearchSortPageByPage)

module.exports = router