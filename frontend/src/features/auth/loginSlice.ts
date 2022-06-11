import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";
import { Role } from "../../components/App";
import { ApiStatus, API_URL_USER, SelectionSessionSettingValue } from "../Utils";

export interface User {
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
}

export interface LoginState {
  token: null | string;
  selectionSessionOpen: null | SelectionSessionSettingValue;
  userData: null | User;
  code: null | string;
  showModal: boolean;
  status: ApiStatus;
};

const initialState: LoginState = {
  token: null,
  selectionSessionOpen: null,
  userData: null,
  code: null,
  showModal: false,
  status: ApiStatus.idle,
};

export interface ILoginRequest {
  email: string;
  password: string;
};

export interface ILoginResponse {
  token: string;
  selection_session_open: SelectionSessionSettingValue;
  user_data: User;
  code: string;
};

export interface ILoginError {
  code: string;
};

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (request: ILoginRequest, {rejectWithValue}) => await axios
    .post(
      API_URL_USER + "/login", 
      request
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return rejectWithValue(error.response.data);
    })
);

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    revertLogin: () => {
      return initialState;
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
      state.selectionSessionOpen = res.selection_session_open;
      state.code = res.code;
      state.userData = res.user_data;
      state.status = ApiStatus.success;
    })
    .addCase(loginAsync.rejected, (state, action) => {
      const res = action.payload as ILoginError;
      state.code = res.code;
      state.showModal = true;
      state.status = ApiStatus.failed;
    })
  }
});

export const { revertLogin }  = loginSlice.actions;

export const loginStatus = (state: RootState) => state.login.status;
export const loginToken = (state: RootState) => state.login.token;
export const loginUserData = (state: RootState) => state.login.userData;
export const loginCode = (state: RootState) => state.login.code;
export const loginShowModal = (state: RootState) => state.login.showModal;
export const loginSelectionSessionOpen = (state: RootState) => state.login.selectionSessionOpen;

export default loginSlice.reducer;