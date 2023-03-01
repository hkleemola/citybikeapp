import { configureStore } from '@reduxjs/toolkit';
import mainstoreReducer from '../features/mainstore/mainstoreSlice';
import stationReducer from '../features/stations/stationSlice';


export const store = configureStore({
  reducer: {
    stations: stationReducer,
    mainstore: mainstoreReducer   
  },
});
