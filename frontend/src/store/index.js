import { configureStore, createSlice } from "@reduxjs/toolkit";
import {persistReducer, persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import userSlice from "./user";
import tokenSlice from "./token";
import { combineReducers } from "@reduxjs/toolkit";
import { useStore } from "react-redux";
import appoSlice from "./appo";

const rootReducer = combineReducers({
  user: userSlice.reducer,
  token: tokenSlice.reducer,
  appo: appoSlice.reducer
  
});

const persistConfig = {
  key: 'root',
  storage,
  version: 1
};

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(
    {serializableCheck: false}
  )
  
});

export const persistor = persistStore(store);
