import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";
import { AuthState, Response } from "../../types";

export const getCurrentUser = createAsyncThunk(
    "auth/getCurrentUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/Authentication/getCurrentUser");
            return response.data;
        } catch (error) {
            if (error && typeof error === 'object' && 'response' in error) {
                return rejectWithValue((error as { response: { data: unknown } }).response.data);
            }
            return rejectWithValue('Lỗi đã xảy ra!');
        }
    }
)

export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials: { email: string, password: string }, { rejectWithValue }) => {
        try {
            const response = await api.post("/Authentication/login", credentials);
            // console.log("check res >>> ", response);

            return response.data;
        } catch (error) {
            if (error && typeof error === 'object' && 'response' in error) {
                return rejectWithValue((error as { response: { data: unknown } }).response.data);
            }
            return rejectWithValue('Lỗi đã xảy ra!');
        }
    }
)

export const signUpUser = createAsyncThunk(
    "auth/signup",
    async (credentials: { fullName: string, email: string, password: string, phoneNumber: string }, { rejectWithValue }) => {
        try {
            const response = await api.post("/Authentication/register", credentials);
            return response.data;
        } catch (error) {
            if (error && typeof error === 'object' && 'response' in error) {
                return rejectWithValue((error as { response: { data: unknown } }).response.data);
            }
            return rejectWithValue('Lỗi đã xảy ra!');
        }
    }
)

const initialState: AuthState = {
    user: null,
    token: null,
    isLoading: false,
    error: null,
    message: null
}

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,

    // reducer sử dụng các hàm bình thường
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.message = "Đăng xuất thành công!";
            localStorage.removeItem("token");
        }
    },

    // extraReducers sử dụng các hàm bất đồng bộ
    extraReducers: (builder) => {
        builder
            .addCase(
                loginUser.pending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                    state.message = null;
                }
            )
            .addCase(
                loginUser.fulfilled,
                (state, action: PayloadAction<Response>) => {
                    state.isLoading = false
                    if (action.payload.isSuccess) {
                        state.user = action.payload.user
                        state.token = action.payload.message;
                        state.message = null;
                        localStorage.setItem("token", action.payload.message);
                    }
                }
            )
            .addCase(
                loginUser.rejected,
                (state, action) => {
                    state.user = null;
                    state.token = null;
                    state.message = null;
                    state.isLoading = false;
                    state.error = (action.payload as { message: string }).message;
                }
            )


            .addCase(
                signUpUser.pending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                    state.message = null;
                }
            )
            .addCase(
                signUpUser.fulfilled,
                (state, action: PayloadAction<Response>) => {
                    state.isLoading = false;
                    state.message = action.payload.message
                }
            )

            .addCase(
                signUpUser.rejected,
                (state, action) => {
                    state.user = null;
                    state.token = null;
                    state.isLoading = false;
                    state.message = null;
                    state.error = (action.payload as { message: string }).message;
                }
            )

            .addCase(getCurrentUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.token = null;
                localStorage.removeItem("token");
            });
    },
});


export const { logout } = authSlice.actions;
export default authSlice.reducer;