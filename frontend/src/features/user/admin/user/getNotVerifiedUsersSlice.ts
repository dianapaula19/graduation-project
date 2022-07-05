import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../../../app/store";
import { ApiStatus, API_URL_COURSE, API_URL_USER } from "../../../Utils";


interface IGetNotVerifiedUsersState {
  status: ApiStatus;
  users: string[] | null;
  code: string | null;
}

const initialState: IGetNotVerifiedUsersState = {
  status: ApiStatus.idle,
  users: null,
  code: null
}

interface IGetNotVerifiedUsersRequest {
  token: string;
}

interface IGetNotVerifiedUsersResponse {
  code: string;
  users: string[]; 
}

interface IGetNotVerifiedUsersError {
  code: string; 
}

export const getNotVerifiedUsersAsync = createAsyncThunk(
  'user/admin/NotVerifiedUsers',
  async (request: IGetNotVerifiedUsersRequest, {rejectWithValue}) => await axios
  .get(
    API_URL_USER + "/admin/not_verified_users",
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

export const getNotVerifiedUsersSlice = createSlice({
  name: 'notVerifiedUsers',
  initialState,
  reducers: {
  revertGetNotVerifiedUsers: () => {
    return initialState;
  }
  },
  extraReducers: (builder) => {
  builder
  .addCase(getNotVerifiedUsersAsync.pending, (state, action) => {
    state.status = ApiStatus.loading;
  })
  .addCase(getNotVerifiedUsersAsync.fulfilled, (state, action) => {
    const res = action.payload as IGetNotVerifiedUsersResponse;
    state.users = res.users;
    state.code = res.code;
    state.status = ApiStatus.success;
  })
  .addCase(getNotVerifiedUsersAsync.rejected, (state, action) => {
    const res = action.payload as IGetNotVerifiedUsersError;
    state.code = res.code;
    state.status = ApiStatus.failed;
  })
  }
});

export const { revertGetNotVerifiedUsers } = getNotVerifiedUsersSlice.actions;

export const getNotVerifiedUsersStatus = (root: RootState) => root.getNotVerifiedUsers.status;
export const getNotVerifiedUsersCode = (root: RootState) => root.getNotVerifiedUsers.code;
export const getNotVerifiedUsersUsers = (root: RootState) => root.getNotVerifiedUsers.users;

export default getNotVerifiedUsersSlice.reducer;