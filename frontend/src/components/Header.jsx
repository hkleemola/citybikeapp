import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setPage, setPages, setResultsOnPage } from '../features/mainstore/mainstoreSlice'
import { countStationsByFilter, readStationsSearchSortPageByPage, setStationItem } from '../features/stations/stationSlice'


// Tekee sovelluksen headerin, jossa:
// ohjelman nimi,
// ja joko: 
//   alasvetovalikko (voi valita montako tulosta näkyy sivulla),
//   tulosten määrän,
//   mahdollinen näppäin edelliselle sivulle pääsemiseksi
//   sivu/sivujen lukumäärä
//   mahdollinen näppäin seuraavalle sivulle pääsemiseksi
// tai:
//   asemalistaan-näppäin
function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { page, resultsOnPage, sortAscending, sortColumn } = useSelector((state) => state.mainstore)
  const { stationItem, stationNimiFilter, stationOsoiteFilter, stationResults, isError, message } = useSelector((state) => state.stations)



  // resultsOnPage valinnan tekeminen saa aikaan resultsOnPagen muuttamisen ja sivujen lukumäärän sekä sivun muuttumisen
  const onChange = (e) => {
    dispatch(setResultsOnPage( e.target.value ))
    dispatch(setPages(Math.ceil(stationResults/e.target.value)))
    dispatch(setPage(0))
  }


  // seuraava sivu -näppäimen painainen aiheuttaa pagen pienenemisen yhdellä
  const NextButton = () => {
    if(page < Math.ceil(stationResults/resultsOnPage)-1 ){
      return (
        <button onClick={() => dispatch(setPage(page+1))} className="close">
          seuraava sivu
        </button>
      )
    }
  }


  // edellinen sivu -näppäimen painaminen aiheuttaa pagen suurenemisen yhdellä
  const PreviousButton = () => {
    if(page > 0){
      return (
        <button onClick={() => dispatch(setPage(page-1))} className="close">
          edellinen sivu
        </button>
      )
    }
  }


  // asemalistaan-näppäin, joka laittaa stationItemin nulliksi ja menee edelliselle sivulle
  const ToStationListButton = () => {
    function handleBackButtonClick() {
      dispatch(setStationItem(null))
      navigate(-1)
    }   
    return (
      <div>
        <button onClick={handleBackButtonClick}>asemalistaan</button>
      </div>
    )    
  }


  // lasketaan tulosten määrä, joka muuttuu vain jos filttereiden sisältö muuttuu
  useEffect(() => {

    const filters = [{
      stationNimiFilter: stationNimiFilter, 
      stationOsoiteFilter: stationOsoiteFilter
    }]
    
    dispatch(countStationsByFilter(filters))
    
    if(isError) {
      console.log(message);
    }

  }, [stationNimiFilter, stationOsoiteFilter])


  // hakee asemat tietokannasta, jos page, resultsOnPage, sortColumn, stationNimiFilter tai stationOsoiteFilter muuttuu 
  useEffect(() => {

    const parameters = [{
      page: page,      
      resultsOnPage: resultsOnPage,
      stationNimiFilter: stationNimiFilter, 
      stationOsoiteFilter: stationOsoiteFilter,
      sortAscending: sortAscending,
      sortColumn: sortColumn
    }]
    
    dispatch(readStationsSearchSortPageByPage(parameters))
        
    if(isError) {
      console.log(message);
    }

  }, [ page, resultsOnPage, sortColumn, stationNimiFilter, stationOsoiteFilter ])



  return (  
    <header>
      <table>
        <caption>
          <h3>Kaupunkipyöräasemat</h3>
        </caption>
        {stationItem ? (
          <caption>
            <ToStationListButton/>
          </caption>
          ) : (
            <tbody>
              <tr>
                <td>
                  <form>
                    <label htmlFor="resultsOnPage">Tuloksia sivulla? </label>
                    <select id="resultsOnPage" name="resultsOnPage" value={resultsOnPage} onChange={onChange}>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="40">40</option>
                      <option value="70">70</option>
                      <option value="100">100</option>
                    </select>
                  </form>
                </td>
                <td>
                </td>
                <td>
                  <p>Tuloksia:<br></br> {stationResults} kpl</p>
                </td>
                <td>
                  <PreviousButton/>
                </td>
                <td>
                  <p>sivu:<br></br> {page+1}/{Math.ceil(stationResults/resultsOnPage)}</p>
                </td>
                <td>
                  <NextButton/>
                </td>
              </tr>
            </tbody>        
          )
        }
      </table>
    </header>
  )
}


export default Header




