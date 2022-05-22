import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";
import { ApiStatus, API_URL } from "../Utils";

export interface RegisterState {
    message: null | string;
    status: ApiStatus;
};

const initialState: RegisterState = {
    message: null,
    status: ApiStatus.idle,
};

export interface IRegisterRequest {
    email: string;
    password: string;
};

export interface IRegisterResponse {
    message: string;
};

export interface IRegisterError {
    error: string;
};

export const registerAsync = createAsyncThunk(
    'auth/register',
    async (request: IRegisterRequest) => await axios
        .post(
            API_URL + "/register",
            request
        )
        .then((response) => {
            return response.data as IRegisterResponse;
        })
        .catch((error) => {
            console.error(error.response.data); 
            return error as IRegisterError;
        })

);

export const registerSlice = createSlice({
    name: 'auth/register',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
        .addCase(registerAsync.pending, (state) => {
            state.status = ApiStatus.loading;
        })
        .addCase(registerAsync.fulfilled, (state, action) => {
            const res = action.payload as IRegisterResponse;
            state.message = res.message;
            state.status = ApiStatus.success;
        })
        .addCase(registerAsync.rejected, (state, action) => {
            const res = action.payload as IRegisterError;
            state.message = res.error;
            state.status = ApiStatus.failed;
        })
    },
});

export const registerStatus = (state: RootState) => state.login.status;
export const registerMessage = (state: RootState) => state.register.message;

export default registerSlice.reducer;
