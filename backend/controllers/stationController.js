const asyncHandler = require('express-async-handler')
const Station = require('../models/stationModel')



// Luo aseman (station)
// Parametrit taulukossa:
// nimi, osoite, kaupunki, operaattori, kapasiteetti, x (x-koordinaatti) ja y (y-koordinaatti)
// @route   POST /api/stations
const createStation = asyncHandler(async (req, res) => {

  if(!req.body.nimi){
    res.status(400).json({message: 'Lisää aseman nimi '})
    res.status(400)
      throw new Error('Ei ole annettu aseman nimeä ')  
  }
  if(!req.body.osoite){
    res.status(400).json({message: 'Lisää aseman osoite '})
    res.status(400)
      throw new Error('Ei ole annettu aseman osoitetta ')  
  }
  if(!req.body.kaupunki){
    res.status(400).json({message: 'Lisää aseman kaupunki '})
    res.status(400)
      throw new Error('Ei ole annettu aseman kaupunkia ')  
  }
  if(!req.body.operaattori){
    res.status(400).json({message: 'Lisää aseman operaattori '})
    res.status(400)
      throw new Error('Ei ole annettu aseman operaattoria ')
  }  
  if(!req.body.kapasiteetti){
    res.status(400).json({message: 'Lisää aseman kapasiteetti '})
    res.status(400)
      throw new Error('Ei ole annettu aseman kapasiteettia ')
  }  
  if(!req.body.x){
    res.status(400).json({message: 'Lisää aseman x-koordinaatti '})
    res.status(400)
      throw new Error('Ei ole annettu aseman x-koordinaattia ')
  }
  if(!req.body.y){
    res.status(400).json({message: 'Lisää aseman y-koordinaatti '})
    res.status(400)
      throw new Error('Ei ole annettu aseman y-koordinaattia ')
  }


  const station = await Station.create({
    nimi: req.body.nimi,
    osoite: req.body.osoite,
    kaupunki: req.body.kaupunki,
    operaattori: req.body.operaattori,
    kapasiteetti: req.body.kapasiteetti,
    x: req.body.x,
    y: req.body.y
  })

  res.status(200).json(station)
})


// Poistaa aseman (station)
// Parametri: id
// @route   DELETE /api/stations
const deleteStation = asyncHandler(async (req, res) => {
  const id = req.params.id
  const station = await Station.findById(id)

  if(!station) {
    res.status(400)
    throw new Error('Asemaa tuolla id:llä ei löytynyt')
  }

  await station.remove()

  res.status(200).json({ id: req.params.id })
})


// Laskee asemien lukumäärän filtterien perusteella
// parametreina filtterit (stationNimiFilter ja stationOsoiteFilter)
// @route   GET /api/stations/filter
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
// @route   GET /api/stations/
const readStation = asyncHandler(async (req, res) => {
  const station = await Station.findById(req.params.id)
  console.log ('stationControllerissa ollaan!!!!')
  if(!station) {
    res.status(400)
    throw new Error('Asemaa tuolla id:llä ei löytynyt')
  }

  res.status(200).json(station)
})


// Hakee asemat
// parametrina parametritaulukko: page, resultsOnPage, stationNimiFilter, stationOsoiteFilter, sortAscending ja sortColumn
// järjestettynä (joko nimen tai osoitteen mukaan)
// @route   GET /api/stations/pagebypage
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
  createStation,
  deleteStation,
  countStationsByFilter,
  readStation,
  readStationsSearchSortPageByPage,
}