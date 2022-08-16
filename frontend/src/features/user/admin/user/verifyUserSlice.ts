import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import axios from "axios";
import { ApiStatus, API_URL_USER } from "features/Utils";

interface IVerifyUserState {
  status: ApiStatus;
  showModal: boolean;
  code: null | string;
}

const initialState: IVerifyUserState = {
  status: ApiStatus.idle,
  showModal: false,
  code: null
}

interface IVerifyUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  token: string;
  role: string;
}

interface IVerifyUserResponse {
  code: string; 
}

interface IVerifyUserError {
  code: string; 
}

export const verifyUserAsync = createAsyncThunk(
  'user/admin/verifyUser',
  async (request: IVerifyUserRequest, {rejectWithValue}) => await axios
  .post(
    API_URL_USER + "/admin/not_verified_users",
    request,
    {
      headers: {
      Authorization: `Bearer ${request.token}`
      }
    }
  )
  .then((response) => {
    return response.data;
  })
  .catch((error) => {
    return rejectWithValue(error.response.data);
  })
)

export const verifyUserSlice = createSlice({
  name: 'verifyUser',
  initialState,
  reducers: {
  revertVerifyUser: () => {
    return initialState;
  }
  },
  extraReducers: (builder) => {
  builder
  .addCase(verifyUserAsync.pending, (state, action) => {
    state.showModal = true;
    state.status = ApiStatus.loading;
  })
  .addCase(verifyUserAsync.fulfilled, (state, action) => {
    const res = action.payload as IVerifyUserResponse;
    state.code = res.code;
    state.showModal = true;
    state.status = ApiStatus.success;
  })
  .addCase(verifyUserAsync.rejected, (state, action) => {
    const res = action.payload as IVerifyUserError;
    state.code = res.code;
    state.showModal = true;
    state.status = ApiStatus.failed;
  })
  }
});

export const { revertVerifyUser } = verifyUserSlice.actions;

export const verifyUserStatus = (root: RootState) => root.verifyUser.status;
export const verifyUserShowModal = (root: RootState) => root.verifyUser.showModal;
export const verifyUserCode = (root: RootState) => root.verifyUser.code;

export default verifyUserSlice.reducer;