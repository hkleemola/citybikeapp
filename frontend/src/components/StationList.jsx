import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Filter from '../components/Filter'
import { setPage, setSortColumn } from '../features/mainstore/mainstoreSlice'
import { setStationOsoiteFilter, setStationNimiFilter } from '../features/stations/stationSlice'

function StationList() {
  const dispatch = useDispatch()
  const { sortColumn } = useSelector((state) => state.mainstore)
  const { stationNimiFilter, stationOsoiteFilter, stations } = useSelector((state) => state.stations)


  return (
    <>
    <div>
      <table>
        <thead>
          <tr>
            <td><strong><small>Haku aseman nimellä:</small></strong></td>
            <td><strong><small>Haku aseman osoitteella:</small></strong></td>
          </tr>
          <tr>
            <td><Filter setFilter={setStationNimiFilter} filter={stationNimiFilter}/></td>
            <td><Filter setFilter={setStationOsoiteFilter} filter={stationOsoiteFilter}/></td>
          </tr>
        </thead>
        <thead title="Taulukko järjestetty tummemman otsikon mukaan. Voit muuttaa järjestystä klikkaamalla vaaleampaa.">
          {sortColumn === 'osoite' ? (
            <tr>           
              <th style={{ color: 'gray', cursor: 'pointer' }} onClick={() => {dispatch(setSortColumn("nimi")); dispatch(setPage(0));}}>nimi</th>
              <th>osoite</th>
            </tr> 
          ) : (
            <tr>
              <th>nimi</th>
              <th style={{ color: 'gray', cursor: 'pointer' }} onClick={() => {dispatch(setSortColumn("osoite")); dispatch(setPage(0));}}>osoite</th>
            </tr> 
          )}
        </thead>  
        <tbody>
        {stations
          .map(stationItem =>
            <tr key={stationItem._id}>
              <td><Link to={`/stations/${stationItem._id}`} title="Klikkaamalla aseman nimeä, pääset katsomaan aseman tarkemmat tiedot.">{stationItem.nimi}</Link></td>
              <td>{stationItem.osoite}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </>
  )
}

export default StationList


