import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import stationService from "./stationService";

const initialState = {
  stationResults: 0,
  stationItem: null,
  stationNimiFilter: '',
  stationOsoiteFilter: '',  
  stations: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: '',
}

// laskee montako tulosta on asemahaussa, jossa filttereinä voivat olla asemien nimien tai osoitteiden alut
export const countStationsByFilter = createAsyncThunk('stations/countStationsByFilter', async (filters, thunkAPI) =>  {
  try {
    return await stationService.countStationsByFilter(filters)
  } catch (error) {
    const message = 
      (error.response && 
        error.response.data && 
        error.response.data.message) || 
      error.message || 
      error.toString()
    return thunkAPI.rejectWithValue(message)  
  }
})


// hakee yhden aseman _id:n perusteella
export const readStation = createAsyncThunk('stations/readStation', async (id, thunkAPI) =>  {
  try {
    return await stationService.readStation(id)
  } catch (error) {
    const message = 
      (error.response && 
        error.response.data && 
        error.response.data.message) || 
      error.message || 
      error.toString()
    return thunkAPI.rejectWithValue(message)  
  }
})


// hakee asemien tiedot
export const readStationsSearchSortPageByPage = createAsyncThunk('stations/readStationsSearchSortPageByPage', async (parameters, thunkAPI) =>  {
  try {    
    return await stationService.readStationsSearchSortPageByPage(parameters)
  } catch (error) {
    const message = 
      (error.response && 
        error.response.data && 
        error.response.data.message) || 
      error.message || 
      error.toString()
    return thunkAPI.rejectWithValue(message)  
  }
})


export const stationSlice = createSlice({
  name: 'stations',
  initialState,
  reducers: {
    reset: (state) => initialState,
    setStationItem: (state, action) => {
      state.stationItem = action.payload
    },
    setStationNimiFilter: (state, action) => {
      state.stationNimiFilter = action.payload
    },
    setStationOsoiteFilter: (state, action) => {
      state.stationOsoiteFilter = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(countStationsByFilter.pending, (state) => {
        state.isLoading = true
      })
      .addCase(countStationsByFilter.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.stationResults = action.payload 
      })
      .addCase(countStationsByFilter.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(readStation.pending, (state) => {
        state.isLoading = true
      })
      .addCase(readStation.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.stationItem = action.payload 
      })
      .addCase(readStation.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(readStationsSearchSortPageByPage.pending, (state) => {
        state.isLoading = true
      })
      .addCase(readStationsSearchSortPageByPage.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.stations = action.payload 
      })
      .addCase(readStationsSearchSortPageByPage.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      
   }
})

export const {reset, setStationItem, setStationNimiFilter, setStationOsoiteFilter} = stationSlice.actions

export default stationSlice.reducer