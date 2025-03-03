import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";

export interface FavoriteState {
    savedRentals: number[];
    error: string | null;
    message: string | null;
    isLoading: boolean;
}

const initialState: FavoriteState = {
    savedRentals: [],
    isLoading: false,
    error: null,
    message: null
};

type FavoriteRentalsResponse = {
    nhaTroId: number;
    isSuccess: boolean;
    message: string | null;
};

export const fetchUserFavorites = createAsyncThunk(
    "favorite/getAllFavoritesByUserId",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/Favorite/GetFavoritesByCurrentUser');
            return response.data;
        } catch (error) {
            if (error && typeof error === 'object' && 'response' in error) {
                return rejectWithValue((error as { response: { data: unknown } }).response.data);
            }
            return rejectWithValue('Lỗi đã xảy ra!');
        }
    }
);

export const addNhaTroToSaveList = createAsyncThunk(
    "favorite/add",
    async (credentials: { nhaTroId: number }, { rejectWithValue }) => {
        try {
            const response = await api.post("/Favorite/AddFavorite", credentials);
            return response.data;
        } catch (error) {
            if (error && typeof error === 'object' && 'response' in error) {
                return rejectWithValue((error as { response: { data: unknown } }).response.data);
            }
            return rejectWithValue('Lỗi đã xảy ra!');
        }
    }
);

const favoriteSlice = createSlice({
    name: "favorite",
    initialState: initialState,
    reducers: {
        addFavoriteLocally: (state, action: PayloadAction<number>) => {
            state.savedRentals = [...state.savedRentals, action.payload];
        },
        removeFavoriteLocally: (state, action: PayloadAction<number>) => {
            state.savedRentals = state.savedRentals.filter(id => id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(
                addNhaTroToSaveList.pending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addCase(
                addNhaTroToSaveList.fulfilled,
                (state, action: PayloadAction<FavoriteRentalsResponse>) => {
                    state.isLoading = false;
                    state.message = action.payload.message;
                    state.savedRentals = [...state.savedRentals, action.payload.nhaTroId];
                }
            )
            .addCase(
                addNhaTroToSaveList.rejected,
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload as string;
                }
            )
            .addCase(
                fetchUserFavorites.pending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addCase(
                fetchUserFavorites.fulfilled,
                (state, action: PayloadAction<number[]>) => {
                    state.isLoading = false;
                    state.savedRentals = action.payload;
                    state.error = null;
                }
            )
            .addCase(
                fetchUserFavorites.rejected,
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload as string;
                }
            );
    }
});

export const { addFavoriteLocally, removeFavoriteLocally } = favoriteSlice.actions;

export default favoriteSlice.reducer;