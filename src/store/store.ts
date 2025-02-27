import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';
import pageReducer from './slices/pageSlice'
export const store = configureStore({
    reducer: {
        auth: authReducer,
        page: pageReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;