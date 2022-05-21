import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";
import { ApiStatus, API_URL } from "../Utils";


export interface AuthState {
    token: null | string;
    statusCode: null | string;
    message: null | string;
    status: ApiStatus;
};

const initialState: AuthState = {
    token: null,
    statusCode: null,
    message: null,
    status: ApiStatus.idle,
};

export interface ILoginRequest {
    email: string;
    password: string;
};

export interface ILoginResponse {
    token: string;
    statusCode: string;
};

export interface ILoginError {
    error: string;
    statusCode: string;
};

export const loginAsync = createAsyncThunk(
    'auth/login',
    async (request: ILoginRequest) => await axios
        .post(
            API_URL + "/login", 
            request
        )
        .then((response) => {
            return response.data as ILoginResponse;
        })
        .catch((error) => {
            return error as ILoginError;
        })
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state: AuthState) => {
            window.sessionStorage.removeItem('token');
            state = initialState;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(loginAsync.pending, (state) => {
            state.status = ApiStatus.loading;
        })
        .addCase(loginAsync.fulfilled, (state, action) => {
            const res = action.payload as ILoginResponse;
            state.token = res.token;
            state.status = ApiStatus.success;
            window.sessionStorage.setItem('token', res.token);
        })
        .addCase(loginAsync.rejected, (state, action) => {
            const res = action.payload as ILoginError;
            state.statusCode = res.statusCode;
            state.message = res.error;
            state.status = ApiStatus.failed;
        })
    }
});

export const { logout } = authSlice.actions;

export const authStatus = (state: RootState) => state.auth.status;

export default authSlice.reducer;