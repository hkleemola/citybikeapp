import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: 0,
  pages: 1,
  resultsOnPage: 40,
  sortColumn: 'nimi',
  message: '',
}


export const mainstoreSlice = createSlice({
  name: 'mainstore',
  initialState,
  reducers: {
    reset: (state) => initialState,
    setPage: (state, action) => {
      state.page = action.payload
    },
    setPages: (state, action) => {
      state.pages = action.payload
    },    
    setResultsOnPage: (state, action) => {
      state.resultsOnPage = action.payload
    },
    setSortColumn: (state, action) => {
      state.sortColumn = action.payload
    }
  }
})

export const {reset, setPage, setPages, setResultsOnPage, setSortColumn} = mainstoreSlice.actions
export default mainstoreSlice.reducer