import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";
import { ApiStatus, API_URL } from "../Utils";


export interface LoginState {
    token: null | string;
    message: null | string;
    status: ApiStatus;
};

const initialState: LoginState = {
    token: null,
    message: null,
    status: ApiStatus.idle,
};

export interface ILoginRequest {
    email: string;
    password: string;
};

export interface ILoginResponse {
    token: string;
};

export interface ILoginError {
    error: string;
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

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        logout: (state: LoginState) => {
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
            state.message = res.error;
            state.status = ApiStatus.failed;
        })
    }
});

export const { logout } = loginSlice.actions;

export const loginStatus = (state: RootState) => state.login.status;
export const loginMessage = (state: RootState) => state.register.message;

export default loginSlice.reducer;