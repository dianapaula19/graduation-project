import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import axios from "axios";
import { ApiStatus, API_URL_USER } from "features/Utils";

interface IDeleteUserState {
  status: ApiStatus;
  showModal: boolean;
  code: null | string;
}

const initialState: IDeleteUserState = {
  status: ApiStatus.idle,
  showModal: false,
  code: null
}

interface IDeleteUserRequest {
  email: string;
  token: string;
}

interface IDeleteUserResponse {
  code: string; 
}

interface IDeleteUserError {
  code: string; 
}

export const deleteUserAsync = createAsyncThunk(
  'user/admin/deleteUser',
  async (
    request: IDeleteUserRequest, 
    {rejectWithValue}
  ) => await axios
  .post(
    API_URL_USER + "/admin/delete_user",
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
    if(error.code === 'ERR_NETWORK'){
      return rejectWithValue({
        'code': 'ERR_NETWORK'
      })
    }
    return rejectWithValue(error.response.data);
  })
)

export const deleteUserSlice = createSlice({
  name: 'deleteUser',
  initialState,
  reducers: {
  revertDeleteUser: () => {
    return initialState;
  }
  },
  extraReducers: (builder) => {
  builder
  .addCase(deleteUserAsync.pending, (state) => {
    state.showModal = true;
    state.status = ApiStatus.loading;
  })
  .addCase(deleteUserAsync.fulfilled, (state, action) => {
    const res = action.payload as IDeleteUserResponse;
    state.code = res.code;
    state.showModal = true;
    state.status = ApiStatus.success;
  })
  .addCase(deleteUserAsync.rejected, (state, action) => {
    const res = action.payload as IDeleteUserError;
    state.code = res.code;
    state.showModal = true;
    state.status = ApiStatus.failed;
  })
  }
});

export const { revertDeleteUser } = deleteUserSlice.actions;

export const deleteUserStatus = (root: RootState) => root.deleteUser.status;
export const deleteUserShowModal = (root: RootState) => root.deleteUser.showModal;
export const deleteUserCode = (root: RootState) => root.deleteUser.code;

export default deleteUserSlice.reducer;