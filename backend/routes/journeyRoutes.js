const express = require('express')
const router = express.Router()
const {
  countAverageDistance,
  countJourneysByDepartureStation,
  countJourneysByFilter,
  countJourneysByReturnStation,
  countMostPopularStationsByDepartureStationName,
  countMostPopularStationsByReturnStationName,
  readJourney, 
  createJourney,
  deleteJourney,
  readJourneysPageByPage,
  readYearsAndMonths,
} = require('../controllers/journeyController')


router.route('/').post(createJourney)
router.route('/:id').get(readJourney).delete(deleteJourney)
router.route('/average/:selection/:station_name/:timeMinFilter/:timeMaxFilter').get(countAverageDistance)
router.route('/departure/:departure_station_name/:departureMinFilter/:departureMaxFilter').get(countJourneysByDepartureStation)
router.route('/filter/:departureStationNimiFilter/:returnStationNimiFilter/:departureMinFilter/:departureMaxFilter/:returnMinFilter/:returnMaxFilter/:distanceMinFilter/:distanceMaxFilter/:durationMinFilter/:durationMaxFilter/').get(countJourneysByFilter)
router.route('/pagebypage/:page/:resultsOnPage/:sortColumn/:departureStationNimiFilter/:returnStationNimiFilter/:departureMinFilter/:departureMaxFilter/:returnMinFilter/:returnMaxFilter/:distanceMinFilter/:distanceMaxFilter/:durationMinFilter/:durationMaxFilter/').get(readJourneysPageByPage)
router.route('/pop_departure/:departure_station_name/:departureMinFilter/:departureMaxFilter').get(countMostPopularStationsByDepartureStationName)
router.route('/pop_return/:return_station_name/:returnMinFilter/:returnMaxFilter').get(countMostPopularStationsByReturnStationName)
router.route('/return/:return_station_name/:returnMinFilter/:returnMaxFilter').get(countJourneysByReturnStation)
router.route('/years_and_months/:field/:amount').get(readYearsAndMonths)


module.exports = router