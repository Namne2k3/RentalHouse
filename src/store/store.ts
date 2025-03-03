import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';
import pageReducer from './slices/pageSlice'
import favoriteReducer from './slices/favoriteSlice'
import searchReducer from './slices/searchSlice'
export const store = configureStore({
    reducer: {
        auth: authReducer,
        page: pageReducer,
        favorite: favoriteReducer,
        search: searchReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;