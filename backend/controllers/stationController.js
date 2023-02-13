const asyncHandler = require('express-async-handler')
const Station = require('../models/stationModel')


// Laskee asemien lukumäärän filtterien perusteella
// parametreina filtterit (stationNimiFilter ja stationOsoiteFilter) 
const countStationsByFilter = asyncHandler(async (req, res) => {
  
  let stationNimiFilter = req.params.stationNimiFilter
  let stationOsoiteFilter = req.params.stationOsoiteFilter

  // muuttaa tyhjatyhja-merkkijonoiksi muutetut takaisin tyhjiksi merkkijonoiksi
  {stationNimiFilter === 'tyhjatyhja' && (stationNimiFilter = '')}
  {stationOsoiteFilter === 'tyhjatyhja' && (stationOsoiteFilter = '')}

  // lisää väkäsen filtterien eteen, niin hakee filttereillä alkavat asemat
  stationNimiFilter = "^" +  stationNimiFilter
  stationOsoiteFilter = "^" +  stationOsoiteFilter

  const results = await Station.find({"nimi": {$regex: stationNimiFilter, $options: 'i'},"osoite": {$regex: stationOsoiteFilter, $options: 'i'}}).count() 
  res.status(200).json(results)
})


// Hakee aseman tiedot
// parametrina _id
const readStation = asyncHandler(async (req, res) => {
  const station = await Station.findById(req.params.id)
  
  if(!station) {
    res.status(400)
    throw new Error('Asemaa tuolla id:llä ei löytynyt')
  }

  res.status(200).json(station)
})


// Hakee asemat
// parametrina parametritaulukko: page, resultsOnPage, stationNimiFilter, stationOsoiteFilter, sortAscending ja sortColumn
// järjestettynä (joko nimen tai osoitteen mukaan)
const readStationsSearchSortPageByPage = asyncHandler(async (req, res) => {
  
  const page = req.params.page
  const resultsOnPage = req.params.resultsOnPage
  const sortAscending = req.params.sortAscending
  const sortColumn = req.params.sortColumn
  
  let stationNimiFilter = req.params.stationNimiFilter
  let stationOsoiteFilter = req.params.stationOsoiteFilter

  // muuttaa tyhjatyhja-merkkijonoiksi muutetut takaisin tyhjiksi merkkijonoiksi
  {stationNimiFilter === 'tyhjatyhja' && (stationNimiFilter = '')}
  {stationOsoiteFilter === 'tyhjatyhja' && (stationOsoiteFilter = '')}
  
  // lisää väkäsen filtterien eteen, niin hakee filttereillä alkavat asemat
  stationNimiFilter = "^" +  stationNimiFilter
  stationOsoiteFilter = "^" +  stationOsoiteFilter

  // vaihtaa järjestyksen aakkosista öökkösiin
  let sort = 1
  {sortAscending === 'false' && (sort = '-1')}
  
  const stations = await Station.find({"nimi": {$regex: stationNimiFilter, $options: 'i'},"osoite": {$regex: stationOsoiteFilter, $options: 'i'}}, {_id: 1, nimi: 1, osoite: 1, fid: 1, kapasiteetti: 1})
                                .sort({[sortColumn]: sort})
                                .skip(page*resultsOnPage).limit(resultsOnPage)

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