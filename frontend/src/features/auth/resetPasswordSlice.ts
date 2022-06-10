import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";
import { Role } from "../../components/App";
import { ApiStatus, API_URL_USER } from "../Utils";

export interface ResetPasswordState {
  code: string | null;
  errorMessage: string | null;
  showModal: boolean;
  status: ApiStatus;
};

const initialState: ResetPasswordState = {
  code: null,
  errorMessage: null,
  showModal: false,
  status: ApiStatus.idle
};

export interface IResetPasswordRequest {
  token: string;
  password: string;
};

export interface IResetPasswordResponse {
  status: string;
};

export interface IResetPasswordError {
  detail: string;
};

export const resetPasswordAsync = createAsyncThunk(
    'auth/resetPassword',
    async (request: IResetPasswordRequest, {rejectWithValue}) => await axios
        .post(
            API_URL_USER + "/password_reset/confirm/", 
            request
        )
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return rejectWithValue(error.response.data);
        })
);

export const resetPasswordSlice = createSlice({
    name: 'resetPassword',
    initialState,
    reducers: {
        revertResetPassword: () => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(resetPasswordAsync.pending, (state) => {
            state.status = ApiStatus.loading;
        })
        .addCase(resetPasswordAsync.fulfilled, (state, action) => {
            const res = action.payload as IResetPasswordResponse;
            state.code = res.status;
            state.showModal = true;
            state.status = ApiStatus.success;
        })
        .addCase(resetPasswordAsync.rejected, (state, action) => {
            const res = action.payload as IResetPasswordError;
            state.errorMessage = res.detail;
            state.showModal = true;
            state.status = ApiStatus.failed;
        })
    }
});

export const { revertResetPassword }  = resetPasswordSlice.actions;

export const resetPasswordStatus = (state: RootState) => state.resetPassword.status;
export const resetPasswordCode = (state: RootState) => state.resetPassword.code;
export const resetPasswordErrorMesssage = (state: RootState) => state.resetPassword.errorMessage;
export const resetPasswordShowModal = (state: RootState) => state.resetPassword.showModal;

export default resetPasswordSlice.reducer;