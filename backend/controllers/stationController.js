const asyncHandler = require('express-async-handler')
const Station = require('../models/stationModel')



//const { sortAscending, sortColumn, stationNameFilter, stationAddressFilter, stations, naytettavat, isLoading, isError, isSuccess, message} = useSelector((state) => state.stations)


// // @desc    Hae reitit
// // @route   GET /api/reitit
// // @access  Private
// const readJourney = asyncHandler(async (req, res) => {
//   const reitit = await Reitti.find()  // hakee kaikki reitit !!!
//   // const reitit = await Reitti.find({ user: req.user.id })  // jos tarvii hakea tietyn käyttäjän reitit
  
//   res.status(200).json(reitit)
// })


// @desc    Hae kaikki asemat(stations)
// @route   GET /api/stations
// @access  Public
const readAllStations = asyncHandler(async (req, res) => {
  console.log('stationController: readAllStations')
  //console.log('stationNameFilter:' + stationNameFilter) // tähän tilttaa
  const stations = await Station.find() 
  // const stations = await Station.find({"nimi": {$regex: stationNameFilter, $options: 'i'}}) // molemmat toimii selaimen osoitekentästä, mutta miksei tästä ohjelmasta?
  res.status(200).json(stations)
})


// @desc    Hae asema(station)
// @route   GET /api/stations
// @access  Public
const readStation = asyncHandler(async (req, res) => {
  const station = await Station.findById(req.params.id)
  
  if(!station) {
    res.status(400)
    throw new Error('Asemaa tuolla id:llä ei löytynyt')
  }

  res.status(200).json(station)
})


// @desc    Hae asema(station)
// @route   GET /api/stations/nimi
// @access  Public
const readStationByNimi = asyncHandler(async (req, res) => {
  console.log('Jihuu')
  console.log(req.body)
  const station = await Station.findOne({nimi: req.params.nimi})
  
  if(!station) {
    res.status(400)
    throw new Error('Asemaa tuolla nimellä ei löytynyt')
  }

  res.status(200).json(station)
})


// @desc    Hae asema(station) KOKEILU
// @route   GET /api/stations/kokeilu/kok
// @access  Public
const readStationKokeilu = asyncHandler(async (req, res) => {
  console.log('Jihuu')
  console.log(req.params)
   
  //const station = await Station.find({kapasiteetti: {$gt: 35}}, 'fid nimi namn').sort({nimi: 1})
  const station = await Station.find({kapasiteetti: {$gt: 35}}, 'fid nimi namn').sort({nimi: 1})
  // lukumäärän saa selville:
  // const station = await Station.find({kapasiteetti: {$gt: 35}}, 'fid nimi namn').sort({nimi: 1}).count()
  if(!station) {
    res.status(400)
    throw new Error('Asemaa tuolla nimellä ei löytynyt, väärä kommentti')
  }

  res.status(200).json(station)
})



// @desc    Hae asema(station) sivu kerrallaan
// @route   GET /api/stations/pagebypage
// @access  Public
// Tällä sunktiolla saa haettua asemat sivu kerrallaan.
// Parametreina: sivunumero / järjestelyparametri eli kentän, jonka mukaan järjestetään, nimi / nimen alkukirjaimet
const readStationsPageByPage = asyncHandler(async (req, res) => {
  console.log('Jihuu')
  console.log(req.params)
  
  // sivulle tulostettava
  const OUTPUT_LIMIT = 10
  // järjestelyparametri, joka saadaan parametrina
  //let sortParam = 'kapasiteetti'
  let sortParam = req.params.sortParam
  // alkukirjaimet parametrina?? voiko olla tyhjä? ei voi olla!!!!
  let startWith = "^" + req.params.startWith
   
  //const stations = await Station.find({return_station_id: {$gt: 0}}).sort({return: -1}).skip(req.params.page).limit(10)
  const stations = await Station.find({"nimi": {$regex: startWith, $options: 'i'}}, {_id: 0, nimi: 1, kapasiteetti: 1}).sort({[sortParam]: 1}).skip(req.params.page).limit(OUTPUT_LIMIT)
  // montako hakutulosta
  const resultCount = await Station.find().count()  //458
  // jos sivulla on 10 tulosta, niin sivuja on tässä tapauksessa 46

  //const stations = await Station.find({}).skip(req.params.page).limit(10)
  //const stations = await Station.find({_id: '63c5061137f1a3ba1c938745'})

  console.log(resultCount)
  console.log(stations)
  console.log(startWith)


  if(!stations) {
    res.status(400)
    throw new Error('Haku tuolla jutulla ei onnistunut, väärä kommentti')
  }

  res.status(200).json(stations)
})





// @desc    Luo asema(station)
// @route   POST /api/stations
// @access  Private
const createStation = asyncHandler(async (req, res) => {
  console.log(req.body)
  // if(!req.body.nimi){
  //   console.log('ei ole annettu nimeä')
  //   // res.status(400).json({message: 'Please add a nimi field'})
  //   res.status(400)
  //     throw new Error('Lisää reitin nimi')  }
  // if(!req.body.pituus){
  //   console.log('ei ole annettu pituutta')
  //   // res.status(400).json({message: 'Please add a nimi field'})
  //   res.status(400)
  //     throw new Error('Lisää reitin pituus')
  // }  
  // if(!req.body.kuvaus){
  //   console.log('ei ole annettu kuvausta')
  //   // res.status(400).json({message: 'Please add a nimi field'})
  //   res.status(400)
  //     throw new Error('Lisää reitin kuvaus')
  // }

  const station = await Station.create({
    nimi: req.body.nimi,
    osoite: req.body.osoite,
    kapasiteetti: req.body.kapasiteetti
  })

  res.status(200).json(station)
})


// // Reitin päivitys ei toimi, mutta homma jatkuu... joskus
// // @desc    Päivitä reitti
// // @route   PUT /api/reitit
// // @access  Private
// const paivitaReitti = asyncHandler(async (req, res) => {
//   const reitti = await Reitti.findById(req.params.id)

//   if(!reitti) {
//     res.status(400)
//     throw new Error('Reittiä ei löytynyt')
//   }

//   // check for user
//   if(!req.user) {
//     res.status(401)
//     throw new Error('Käyttäjää ei löytynyt')
//   }

//   // make sure the logged in user matches the reitti user
//   if(reitti.user.toString() !== req.user.id){
//     res.status(401)
//     throw new Error('Käyttäjällä ei ole valtuuksia')   
//   }

//   // const paivitettyReitti = await Reitti.create({
//   //   nimi: req.body.nimi,
//   //   pituus: req.body.pituus,
//   //   kuvaus: req.body.kuvaus,
//   //   user: req.user.id,
//   //   reittityypit: {melonta: req.body.melonta, pyoraily: req.body.pyoraily, vaellus: req.body.vaellus},
//   // })

//   // const paivitettyReitti = {
//   //   nimi: req.body.nimi,
//   //   pituus: req.body.pituus,
//   //   kuvaus: req.body.kuvaus,
//   //   user: req.user.id,
//   //   reittityypit: {melonta: req.body.melonta, pyoraily: req.body.pyoraily, vaellus: req.body.vaellus},
//   // }

//   // päivityshän ei toimi, joten vian etsintä jatkuu jossain vaiheessa
//   const paivitettyReitti = await Reitti.updateOne(
//     {_id: req.params.id},
//     {$set:  
//       { 
//         nimi: req.body.nimi,
//         pituus: req.body.pituus,
//         kuvaus: req.body.kuvaus,
//         user: req.user.id,
//         reittityypit: {melonta: req.body.melonta, pyoraily: req.body.pyoraily, vaellus: req.body.vaellus},
//       }
//     }
//   ) 

//   // // onko tässä nyt jotain vikaa???????????????????????????????????????
//   // tämä oli se alkuperäinen
//   // const paivitettyReitti = await Reitti.findByIdAndUpdate(req.params.id, req.
//   //   body, {
//   //   new: true,
//   // })

//   res.status(200).json(paivitettyReitti)
// })


// @desc    Poista asema(station)
// @route   DELETE /api/Stations
// @access  Public
const deleteStation = asyncHandler(async (req, res) => {
  const station = await Station.findById(req.params.id)

  if(!station) {
    res.status(400)
    throw new Error('Asemaa tuolla id:llä ei löytynyt')
  }

  await station.remove()

  res.status(200).json({ id: req.params.id })
})


module.exports = {
  createStation,
  deleteStation,
  readAllStations,
  readStation,
  readStationsPageByPage,
}