import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';
import pageReducer from './slices/pageSlice'
import favoriteReducer from './slices/favoriteSlice'
import searchReducer from './slices/searchSlice'
import rentalDetailReducer from './slices/rentalDetailSlice'
export const store = configureStore({
    reducer: {
        auth: authReducer,
        page: pageReducer,
        favorite: favoriteReducer,
        search: searchReducer,
        rentalDetail: rentalDetailReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;