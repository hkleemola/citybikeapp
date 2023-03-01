import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { readStation } from '../features/stations/stationSlice'

function Station() {

  const id = useParams().id 
  const dispatch = useDispatch()
  const { stationItem, isError, message} = useSelector((state) => state.stations)
  
 
  useEffect(() => {

    if(isError) {
      console.log(message);
    }

    dispatch(readStation(id))

  }, [])

   
  return (
    <>      
      <section>
        {stationItem ? 
          <table>
            <tbody>
              <tr>
                <td>nimi:</td>
                <td>{stationItem.nimi}</td>
              </tr>
              <tr>
              <td>namn:</td>
                <td>{stationItem.namn}</td>
              </tr>
              <tr>
              <td>name:</td>
                <td>{stationItem.name}</td>
              </tr>
              <tr>
              <td>osoite:</td>
                <td>{stationItem.osoite}, {stationItem.kaupunki}</td>
              </tr>
              <tr>
                <td>adress:</td>
                <td>{stationItem.adress}, {stationItem.stad}</td>
              </tr>
              <tr>
                <td>koordinaatit:  </td>
                <td>x: {stationItem.x} y: {stationItem.y}</td>
              </tr>
              <tr>
                <td>operaattori:</td>
                <td>{stationItem.operaattori}</td>
              </tr>
              <tr>
                <td>kapasiteetti:</td>
                <td>{stationItem.kapasiteetti}</td>
              </tr>
            </tbody>
          </table>
          : <></>
        }
      </section>
    </>
  )
}

export default Station

