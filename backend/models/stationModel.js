const mongoose = require('mongoose')

const stationSchema = mongoose.Schema(
  {
    fid: {
      type: Number,
      unique: true,
      required: [true, 'Lisää reitin FID']
    },
    id: {
      type: Number,
      unique: true,
      required: [true, 'Lisää reitin ID']
    },
    nimi: {
      type: String,
      unique: true,
      required: [true, 'Lisää aseman nimi']
    },
    namn: {
      type: String,
      unique: true,
      required: [true, 'Lisää aseman namn']
    },
    name: {
      type: String,
      unique: true,
      required: [true, 'Lisää aseman name']
    },
    osoite: {
      type: String,
      required: [true, 'Lisää aseman osoite']
    },
    adress: {
      type: String,
      required: [true, 'Lisää aseman adress']
    },
    kaupunki: {
      type: String,
      required: [true, 'Lisää aseman kaupunki']
    },
    stad: {
      type: String,
      required: [true, 'Lisää aseman stad']
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

