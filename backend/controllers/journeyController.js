const asyncHandler = require('express-async-handler')
const Journey = require('../models/journeyModel')


// Laskee asemalta lähteneiden/ asemalle päättyneiden matkojen pituuksien keskiarvon
// Parametri:
// valinta (selection) (joko 
// * lähtöaseman nimen (departure_station_name => "departure") tai 
// * lopetusaseman nimen (return_station_name => "return") mukaan
// aseman nimi (station_name)
// pienin aika (timeMinFilter)
// suurin aika (timeMaxFilter)
// @route   GET /api/journeys
const countAverageDistance = asyncHandler(async (req, res) => {

  const station_name = req.params.station_name
  const selection = req.params.selection
  const timeMinFilter = req.params.timeMinFilter
  const timeMaxFilter = req.params.timeMaxFilter

  let time = ""

  if( selection === "return_station_name"){
    time = "return"
  }
  if( selection === "departure_station_name"){
    time = "departure"
  }
  
  const count = await Journey.aggregate([
    { $match: { [selection]: { $regex: new RegExp(station_name, "i") },
                [time]: { $gte: timeMinFilter, $lt: timeMaxFilter }
              } 
    },
    {
      $project: {
        distance_double: {
          $convert: {
            input: "$covered_distance",
            to: "double"
          }
        }
      }
    },
    { $group: { _id: null, sumDistance: { $sum: "$distance_double" }, avgDistance: { $avg: "$distance_double" } } }
  ])
  
  if(!count) {
    res.status(400)
    throw new Error('Matkoja noilla ehdoilla ei löytynyt')
  }
  res.status(200).json(count)
})


// Laskee matkat(journeys) lähtöaseman nimen mukaan eli montako matkaa on kyseiseltä asemalta aloitettu tiettynä ajanjaksona
// Parametrit: 
// lähtöasema (departure_station_name)
// pienin lähtöaika (departureMinFilter)
// suurin lähtöaika (departureMaxFilter)
// @route   GET /api/journeys/departure
const countJourneysByDepartureStation = asyncHandler(async (req, res) => {

  const departure_station_name = req.params.departure_station_name
  const departureMinFilter = req.params.departureMinFilter
  const departureMaxFilter = req.params.departureMaxFilter

  const resultCount = await Journey.find({"departure_station_name": {$regex: new RegExp(departure_station_name, "i")}, "departure": { $gte: departureMinFilter, $lt: departureMaxFilter } }).count()
  
  res.status(200).json(resultCount)
})


// Laskee matkat(journeys) suodattimien mukaan
// Parametrit:
// lähtöaseman alkukirjaimet (departureStationNimiFilter),
// palautusaseman alkukirjaimet (returnStationNimiFilter), 
// pienin lähtöaika (departureMinFilter),
// suurin lähtöaika (departureMaxFilter),
// pienin palautusaika(returnMinFilter),
// suurin palautusaika (returnMaxFilter),
// pienin ajettu matka (distanceMinFilter),
// suurin ajettu matka (distanceMaxFilter),
// pienin kesto (durationMinFilter),
// suurin kesto (durationMaxFilter)
// @route   GET /api/journeys/filter
const countJourneysByFilter = asyncHandler(async (req, res) => {

  const departureStationNimiFilter = "^" + req.params.departureStationNimiFilter
  const returnStationNimiFilter = "^" + req.params.returnStationNimiFilter
  const departureMinFilter = req.params.departureMinFilter
  const departureMaxFilter =  req.params.departureMaxFilter
  const returnMinFilter = req.params.returnMinFilter
  const returnMaxFilter = req.params.returnMaxFilter
  const distanceMinFilter = req.params.distanceMinFilter
  const distanceMaxFilter = req.params.distanceMaxFilter
  const durationMinFilter = req.params.durationMinFilter
  const durationMaxFilter = req.params.durationMaxFilter

  const journeys = await Journey.aggregate([
      { $match: {
        departure_station_name: { $regex: departureStationNimiFilter, $options: 'i'},
        return_station_name: { $regex: returnStationNimiFilter, $options: 'i'},
        departure: {
          $gte: departureMinFilter,
          $lte: departureMaxFilter
        },
        return: {
          $gte: returnMinFilter,
          $lte: returnMaxFilter
        },
        covered_distance: { $gte: parseInt(distanceMinFilter), $lte: parseInt(distanceMaxFilter) },
        duration: { $gte: parseInt(durationMinFilter), $lte: parseInt(durationMaxFilter) }
      }
    },
      { $count: 'results' }
    ])
 
  res.status(200).json(journeys)
})


// Laskee matkat(journeys) palautusaseman mukaan eli montako matkaa kyseiselle asemalle on päättynyt
// Parametrit: 
// palautusasema (return_station_name)
// pienin palautusaika (returnMinFilter)
// suurin palautusaika (returnMaxFilter)
// @route   GET /api/journeys/return
const countJourneysByReturnStation = asyncHandler(async (req, res) => {

  const return_station_name = req.params.return_station_name
  const returnMinFilter = req.params.returnMinFilter
  const returnMaxFilter = req.params.returnMaxFilter

  const resultCount = await Journey.find({"return_station_name": {$regex: new RegExp(return_station_name, "i")}, "return": { $gte: returnMinFilter, $lt: returnMaxFilter } }).count() 
  
  res.status(200).json(resultCount)
})


// Laskee viisi suosituinta asemaa, joille lähdetty parametrina annetulta asemalta
// Parametri: 
// lähtöasema (departure_station_name)
// pienin lähtöaika (departureMinFilter)
// suurin lähtöaika (departureMaxFilter)
// @route   GET /api/journeys/pop_departure
const countMostPopularStationsByDepartureStationName = asyncHandler(async (req, res) => {

  const departure_station_name = req.params.departure_station_name
  const departureMinFilter = req.params.departureMinFilter
  const departureMaxFilter = req.params.departureMaxFilter

  const resultCount = await Journey.aggregate([
    { 
      $match: { 
        departure_station_name: { $regex: new RegExp(departure_station_name, "i") },
        departure: {
          $gte: departureMinFilter,
          $lte: departureMaxFilter
        },
      }
    },
    { 
        $group: { _id: { from: "$departure_station_name", to: "$return_station_name" }, count: { $sum: 1 } } 
    },
    { 
        $sort: { count: -1 } 
    },
    { 
        $limit: 5
    }
  ]) 

  res.status(200).json(resultCount)
})


// Laskee viisi suosituinta asemaa, joilta lähdetty parametrina annetulle asemalle
// Parametri: 
// palautusasema (return_station_name)
// pienin palautusaika (returnMinFilter)
// suurin palautusaika (returnMaxFilter)
// @route   GET /api/journeys/pop_return
const countMostPopularStationsByReturnStationName = asyncHandler(async (req, res) => {

  const return_station_name = req.params.return_station_name
  const returnMinFilter = req.params.returnMinFilter
  const returnMaxFilter = req.params.returnMaxFilter  

  const resultCount = await Journey.aggregate([
    { 
      $match: { 
        return_station_name: { $regex: new RegExp(return_station_name, "i") },
        return: {
          $gte: returnMinFilter,
          $lte: returnMaxFilter
        },
      } 
    },
    { 
        $group: { _id: { from: "$departure_station_name", to: "$return_station_name" }, count: { $sum: 1 } } 
    },
    { 
        $sort: { count: -1 } 
    },
    { 
        $limit: 5
    }
  ])

  res.status(200).json(resultCount)
})


// Luo matkan(journey)
// Parametrit taulukossa:
// lähtöaika (departure)
// palautusaika (return)
// matkan kesto (duration)
// matkan pituus (covered_distance)
// palautusasema (return_station_name)
// lähtöasema (departure_station_name)
// @route   POST /api/journeys
const createJourney = asyncHandler(async (req, res) => {

  if(!req.body.departure){
    res.status(400).json({message: 'Lisää matkan lähtöaika '})
    res.status(400)
      throw new Error('Ei ole annettu matkan lähtöaikaa')  
  }
  if(!req.body.return){
    res.status(400).json({message: 'Lisää pyörän palautusaika '})
    res.status(400)
      throw new Error('Ei ole annettu pyörän palautusaikaa')  
  }
  if(!req.body.duration){
    res.status(400).json({message: 'Lisää matkan kesto '})
    res.status(400)
      throw new Error('Ei ole annettu matkan kestoa')  
  }
  if(!req.body.covered_distance){
    res.status(400).json({message: 'Lisää matkan pituus '})
    res.status(400)
      throw new Error('Ei ole annettu matkan pituutta')
  }  
  if(!req.body.departure_station_name){
    res.status(400).json({message: 'Lisää matkan lähtöasema '})
    res.status(400)
      throw new Error('Ei ole annettu matkan lähtöaseman nimeä')
  }  
  if(!req.body.return_station_name){
    res.status(400).json({message: 'Lisää matkan palautusaseman nimi '})
    res.status(400)
      throw new Error('Ei ole annettu palautusaseman nimeä')
  }

  const journey = await Journey.create({
    departure: req.body.departure,
    return: req.body.return,
    duration: req.body.duration,
    covered_distance: req.body.covered_distance,
    return_station_name: req.body.return_station_name,
    departure_station_name: req.body.departure_station_name,
  })

  res.status(200).json(journey)
})


// Poistaa matkan(journey)
// Parametri: id
// @route   DELETE /api/journeys
const deleteJourney = asyncHandler(async (req, res) => {

  const id = req.params.id
  const journey = await Journey.findById(id)

  if(!journey) {
    res.status(400)
    throw new Error('Matkaa tuolla id:llä ei löytynyt')
  }

  await journey.remove()

  res.status(200).json({ id: req.params.id })
})


// Hakee matkan(journey)
// Parametri: _id
// @route   GET /api/journeys
const readJourney = asyncHandler(async (req, res) => {

  const journey = await Journey.findById(req.params.id)
  
  if(!journey) {
    res.status(400)
    throw new Error('Matkaa tuolla id:llä ei löytynyt')
  }

  res.status(200).json(journey)
})


// Hakee matkat (journeys) sivu kerrallaan
// Parametrit:
// näytettävä sivu (page)
// sarake, minkä mukaan järjestetään (sortColumn)
// sivulla näkyvien tulosten lukumäärä (resultsOnPage)
// lähtöaseman nimi (departureStationNimiFilter)
// palautusaseman nimi (returnStationNimiFilter)
// pienin lähtöajankohta (departureMinFilter)
// suurin lähtöajankohta (departureMaxFilter)
// pienin palautusajankohta (returnMinFilter)
// suurin palautusajankohta(returnMaxFilter)
// pienin matkan pituus(distanceMinFilter)
// suurpin matkan pituus(distanceMaxFilter)
// pienin matkan kesto (durationMinFilter)
// suurin matkan kesto (durationMaxFilter)
// @route   GET /api/journeys/pagebypage
const readJourneysPageByPage = asyncHandler(async (req, res) => {

  const page = req.params.page  
  const sortColumn = req.params.sortColumn
  const resultsOnPage = req.params.resultsOnPage  
  const departureStationNimiFilter = "^" + req.params.departureStationNimiFilter
  const returnStationNimiFilter = "^" + req.params.returnStationNimiFilter
  const departureMinFilter = req.params.departureMinFilter
  const departureMaxFilter =  req.params.departureMaxFilter
  const returnMinFilter = req.params.returnMinFilter
  const returnMaxFilter = req.params.returnMaxFilter
  const distanceMinFilter = req.params.distanceMinFilter
  const distanceMaxFilter = req.params.distanceMaxFilter
  const durationMinFilter = req.params.durationMinFilter
  const durationMaxFilter = req.params.durationMaxFilter
  
  const journeys = await Journey.aggregate([
    { $match: {
        departure_station_name: { $regex: departureStationNimiFilter, $options: 'i'},
        return_station_name: { $regex: returnStationNimiFilter, $options: 'i'},
        departure: {
          $gte: departureMinFilter,
          $lte: departureMaxFilter
        },
        return: {
          $gte: returnMinFilter,
          $lte: returnMaxFilter
        },
        covered_distance: { $gte: parseInt(distanceMinFilter), $lte: parseInt(distanceMaxFilter) },
        duration: { $gte: parseInt(durationMinFilter), $lte: parseInt(durationMaxFilter) }
      }
    },
    { $project: { _id: 1, departure: 1, return: 1, departure_station_name: 1, return_station_name: 1, covered_distance: 1, duration: 1 } },
    { $sort: { [sortColumn]: 1 } },
    { $skip: page*resultsOnPage }, 
    { $limit: parseInt(resultsOnPage) },   
  ])

  if(!journeys) {
    res.status(400)
    throw new Error('Haku noilla ehdoilla ei onnistunut')
  }

  res.status(200).json(journeys)
})


// Hakee matkojen departure- tai return-kentissä olevat eri vuodet (tai vuodet ja kuukaudet), jotta ne voi
// näyttää alasvetovalikossa, josta valitaan jakso jolta tulokset näytetään
// Parametrit:
// kenttä (field, joka on joko departure tai return), jolta vuodet (tai vuodet ja kuukaudet) haetaan
// määrä (amount) eli montako lukua merkkijonosta tarvitaan, jos halutaan vain vuosi, niin 4, jos sekä vuosi että kuukausi, niin 7
// @route   GET /api/journeys/years_and_months
const readYearsAndMonths = asyncHandler(async (req, res) => {
  
  const field = "$" + req.params.field
  const amount = parseInt(req.params.amount)

  const result = await Journey.aggregate([
    { $project: { vuosi: { $substr: [field, 0, amount] } } },
    { $group: { _id: "$vuosi" } },
    { $sort: { _id: 1 } } 
  ])

  res.status(200).json(result)
})


module.exports = {  
  countAverageDistance,
  countJourneysByDepartureStation,
  countJourneysByFilter,
  countJourneysByReturnStation,
  countMostPopularStationsByDepartureStationName,
  countMostPopularStationsByReturnStationName,
  createJourney,
  deleteJourney,
  readJourney,
  readJourneysPageByPage,
  readYearsAndMonths,
}