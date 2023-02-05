const asyncHandler = require('express-async-handler')
const Station = require('../models/stationModel')


// Laskee filtterien (stationNimiFilter ja stationOsoiteFilter) perusteella asemat(stations)
const countStationsByFilter = asyncHandler(async (req, res) => {
  
  let stationNimiFilter = req.params.stationNimiFilter
  let stationOsoiteFilter = req.params.stationOsoiteFilter
  {stationNimiFilter === 'tyhjatyhja' && (stationNimiFilter = '')}
  {stationOsoiteFilter === 'tyhjatyhja' && (stationOsoiteFilter = '')}

  const results = await Station.find({"nimi": {$regex: stationNimiFilter, $options: 'i'},"osoite": {$regex: stationOsoiteFilter, $options: 'i'}}).count() 
  res.status(200).json(results)
})


// Hakee aseman(station) _id numeron perusteella, jonka saa StationListasta
const readStation = asyncHandler(async (req, res) => {
  const station = await Station.findById(req.params.id)
  
  if(!station) {
    res.status(400)
    throw new Error('Asemaa tuolla id:llä ei löytynyt')
  }

  res.status(200).json(station)
})


// Hakee aseman(station) tiedot filtterien (stationNimiFilter ja stationOsoiteFilter) perusteella
// järjesteltynä nimen tai osoitteen perusteella, sivu kerrallaan
// Parametrina taulukko, jossa page, resultsOnPage, sortAscending, sortColumn, stationNimiFilter, stationOsoiteFilter, 
const readStationsSearchSortPageByPage = asyncHandler(async (req, res) => {
  console.log('stationController: readStationsSearchSortPageByPage')
  console.log('stationControlleriin tulleet:' + req.params)
  
  const page = req.params.page
  const resultsOnPage = req.params.resultsOnPage
  const sortAscending = req.params.sortAscending
  const sortColumn = req.params.sortColumn

  let stationNimiFilter = req.params.stationNimiFilter
  let stationOsoiteFilter = req.params.stationOsoiteFilter
  {stationNimiFilter === 'tyhjatyhja' && (stationNimiFilter = '')}
  {stationOsoiteFilter === 'tyhjatyhja' && (stationOsoiteFilter = '')}
  stationNimiFilter = "^" +  stationNimiFilter
  stationOsoiteFilter = "^" +  stationOsoiteFilter

  let sort = 1
  {sortAscending === 'false' && (sort = '-1')}
  
  const stations = await Station.find({"nimi": {$regex: stationNimiFilter, $options: 'i'},"osoite": {$regex: stationOsoiteFilter, $options: 'i'}}, {_id: 0, nimi: 1, osoite: 1, fid: 1, kapasiteetti: 1})
                                .sort({[sortColumn]: sort})
                                .skip(page).limit(resultsOnPage)

  if(!stations) {
    res.status(400)
    throw new Error('Haku tuolla jutulla ei onnistunut, väärä kommentti')
  }

  res.status(200).json(stations)
})



module.exports = {
  countStationsByFilter,
  readStation,
  readStationsSearchSortPageByPage,
}