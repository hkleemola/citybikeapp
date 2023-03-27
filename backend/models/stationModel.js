const mongoose = require('mongoose')

const stationSchema = mongoose.Schema(
  {
    fid: {
      type: Number
    },
    id: {
      type: Number
    },
    nimi: {
      type: String,
      unique: true,
      required: [true, 'Lisää aseman nimi']
    },
    namn: {
      type: String
    },
    name: {
      type: String
    },
    osoite: {
      type: String,
      required: [true, 'Lisää aseman osoite']
    },
    adress: {
      type: String,
    },
    kaupunki: {
      type: String,
      required: [true, 'Lisää aseman kaupunki']
    },
    stad: {
      type: String
    },
    operaattori: {
      type: String,
      required: [true, 'Lisää aseman operaattori']
    },
    kapasiteetti: {
      type: Number,
      required: [true, 'Lisää aseman kapasiteetti']
    },
    x: {
      type: Number,
      required: [true, 'Lisää aseman sijainnin x-koordinaatti']
    },
    y: {
      type: Number,
      required: [true, 'Lisää aseman sijainnin y-koordinaatti']
    },
  }
)


module.exports = mongoose.model('Station', stationSchema)

