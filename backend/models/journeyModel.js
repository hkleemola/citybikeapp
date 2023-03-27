const mongoose = require('mongoose')

const journeySchema = mongoose.Schema(
  {
    departure: {
      type: String,
      // required: [true, 'Lisää matkan aloitusaika, esimerkiksi: 2023-03-22T08:12:45']
    },
    return: {
      type: String,
      // required: [true, 'Lisää matkan palautusaika, esimerkiksi: 2023-03-22T08:12:45']
    },
    departure_station_id: {
      type: Number
    },
    departure_station_name: {
      type: String,
      // required: [true, 'Lisää matkan lähtöaseman nimi']
    },
    return_station_id: {
      type: Number
    },
    return_station_name: {
      type: String,
      // required: [true, 'Lisää matkan palautusaseman nimi']
    },
    covered_distance: {
      type: String,
      // required: [true, 'Lisää matkan pituus metreinä']
    },
    duration: {
      type: String,
      // required: [true, 'Lisää matkan kesto sekuntteina']
    }
  }
)

module.exports = mongoose.model('Journey', journeySchema)
