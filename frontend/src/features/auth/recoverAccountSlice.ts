import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";
import { Role } from "../../components/App";
import { ApiStatus, API_URL_USER } from "../Utils";

export interface RecoverAccountState {
    code: string | null;
    errorMessages: string[] | null;
    showModal: boolean;
    status: ApiStatus;
};

const initialState: RecoverAccountState = {
    code: null,
    errorMessages: null,
    showModal: false,
    status: ApiStatus.idle
};

export interface IRecoverAccountRequest {
    email: string;
};

export interface IRecoverAccountResponse {
    status: string;
};

export interface IRecoverAccountError {
    email: string[];
};

export const recoverAccountAsync = createAsyncThunk(
    'auth/recoverAccount',
    async (request: IRecoverAccountRequest, {rejectWithValue}) => await axios
        .post(
            API_URL_USER + "/password_reset/", 
            request
        )
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return rejectWithValue(error.response.data);
        })
);

export const recoverAccountSlice = createSlice({
    name: 'recoverAccount',
    initialState,
    reducers: {
        revertRecoverAccount: () => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(recoverAccountAsync.pending, (state) => {
            state.status = ApiStatus.loading;
        })
        .addCase(recoverAccountAsync.fulfilled, (state, action) => {
            const res = action.payload as IRecoverAccountResponse;
            state.code = res.status;
            state.showModal = true;
            state.status = ApiStatus.success;
        })
        .addCase(recoverAccountAsync.rejected, (state, action) => {
            const res = action.payload as IRecoverAccountError;
            state.errorMessages = res.email;
            state.showModal = true;
            state.status = ApiStatus.failed;
        })
    }
});

export const { revertRecoverAccount }  = recoverAccountSlice.actions;

export const recoverAccountStatus = (state: RootState) => state.recoverAccount.status;
export const recoverAccountCode = (state: RootState) => state.recoverAccount.code;
export const recoverAccountErrorMesssages = (state: RootState) => state.recoverAccount.errorMessages;
export const recoverAccountShowModal = (state: RootState) => state.recoverAccount.showModal;

export default recoverAccountSlice.reducer;