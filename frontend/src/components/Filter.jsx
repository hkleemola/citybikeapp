import React from "react"
import {useDispatch } from 'react-redux'
import { setPage } from "../features/mainstore/mainstoreSlice"

// asettaa storen muuttujaan (filter) arvon e.target.value ja asettaa sivun nollaksi
const Filter = (props) => {
  const dispatch = useDispatch()

  return (
    <form>
      <div> 
        <input value={props.filter} onChange={e => {dispatch(props.setFilter(e.target.value)); dispatch(setPage(0))}}/>
      </div>
    </form>
  )
}

export default Filter