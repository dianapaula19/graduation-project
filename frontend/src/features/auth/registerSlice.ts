import { createAsyncThunk, createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";
import { ApiStatus, API_URL_USER } from "../Utils";

export interface RegisterState {
    code: null | string;
    showModal: boolean;
    status: ApiStatus;
};

const initialState: RegisterState = {
    code: null,
    showModal: false,
    status: ApiStatus.idle,
};

export interface IRegisterRequest {
    email: string;
    password: string;
};

export interface IRegisterResponse {
    code: string;
};

export interface IRegisterError {
    code: string;
};

export const registerAsync = createAsyncThunk(
    'auth/register',
    
    async (request: IRegisterRequest, {rejectWithValue}) => await axios
        .post(
            API_URL_USER + "/register",
            request
        )
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return rejectWithValue(error.response.data);
        })

);

export const registerSlice = createSlice({
    name: 'auth/register',
    initialState,
    reducers: {
        revert: () => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(registerAsync.pending, (state) => {
            state.status = ApiStatus.loading;
        })
        .addCase(registerAsync.fulfilled, (state, action) => {
            const res = action.payload as IRegisterResponse;
            state.code = res.code;
            state.showModal = true;
            state.status = ApiStatus.success;
        })
        .addCase(registerAsync.rejected, (state, action) => {
            const res = action.payload as IRegisterError;
            state.code = res.code;
            state.showModal = true;
            state.status = ApiStatus.failed;
        })
    },
});

export const { revert } = registerSlice.actions;

export const registerStatus = (state: RootState) => state.register.status;
export const registerCode = (state: RootState) => state.register.code;
export const registerShowModal = (state: RootState) => state.register.showModal;

export default registerSlice.reducer;
