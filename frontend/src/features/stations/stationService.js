import axios from 'axios'

const API_URL = '/api/stations/'


// Laskee asemien lukumäärän
// parametrina taulukko, jossa nimi- ja osoitefiltterit
const countStationsByFilter = async (filters) => {  

  let stationNimiFilter = filters[0].stationNimiFilter
  let stationOsoiteFilter = filters[0].stationOsoiteFilter
  // laitetaan tyhjän merkkijonon paikalle merkkijono: tyhjatyhja, koska http-osoitteessa ei saa olla tyhjää
  {stationNimiFilter === '' && (stationNimiFilter = 'tyhjatyhja')}
  {stationOsoiteFilter === '' && (stationOsoiteFilter = 'tyhjatyhja')}

  const response = await axios.get(API_URL + 'filter/' + stationNimiFilter + '/' + stationOsoiteFilter)

  return response.data
}


// Hakee aseman
// parametrina _id
const readStation = async (stationId) => {

  const response = await axios.get(API_URL + stationId)

  return response.data
}


// Hakee asemat
// parametrina parametritaulukko: page, resultsOnPage, stationNimiFilter, stationOsoiteFilter, sortAscending ja sortColumn
// järjestettynä (joko nimen tai osoitteen mukaan)
const readStationsSearchSortPageByPage = async (parameters) => { 

  const page = parameters[0].page
  const resultsOnPage = parameters[0].resultsOnPage
  let stationNimiFilter = parameters[0].stationNimiFilter
  let stationOsoiteFilter = parameters[0].stationOsoiteFilter
  const sortAscending = parameters[0].sortAscending
  const sortColumn = parameters[0].sortColumn
 
  // laitetaan tyhjän merkkijonon paikalle merkkijono: tyhjatyhja, koska http-osoitteessa ei saa olla tyhjää
  {stationNimiFilter === '' && (stationNimiFilter = 'tyhjatyhja')}
  {stationOsoiteFilter === '' && (stationOsoiteFilter = 'tyhjatyhja')}

  const response = await axios.get(API_URL + 'pagebypage/' + page + '/' + resultsOnPage + '/' + stationNimiFilter + '/' + stationOsoiteFilter + '/' + sortAscending + '/' + sortColumn)
  
  return response.data
}


const stationService = {
  countStationsByFilter,
  readStation,
  readStationsSearchSortPageByPage,
}

export default stationService