import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import axios from "axios";
import { ApiStatus, API_URL_COURSE } from "features/Utils";

interface IDeleteOptionsListState {
  status: ApiStatus;
  showModal: boolean;
  code: null | string;
}

const initialState: IDeleteOptionsListState = {
  status: ApiStatus.idle,
  showModal: false,
  code: null
}

interface IDeleteOptionsListRequest {
  id: number;
  token: string;
}

interface IDeleteOptionsListResponse {
  code: string; 
}

interface IDeleteOptionsListError {
  code: string; 
}

export const deleteOptionsListAsync = createAsyncThunk(
  'user/admin/deleteOptionsList',
  async (
    request: IDeleteOptionsListRequest, 
    {rejectWithValue}
  ) => await axios
  .post(
    API_URL_COURSE + "/admin/delete_options_list",
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

export const deleteOptionsListSlice = createSlice({
  name: 'deleteOptionsList',
  initialState,
  reducers: {
  revertDeleteOptionsList: () => {
    return initialState;
  }
  },
  extraReducers: (builder) => {
  builder
  .addCase(deleteOptionsListAsync.pending, (state, action) => {
    state.showModal = true;
    state.status = ApiStatus.loading;
  })
  .addCase(deleteOptionsListAsync.fulfilled, (state, action) => {
    const res = action.payload as IDeleteOptionsListResponse;
    state.code = res.code;
    state.showModal = true;
    state.status = ApiStatus.success;
  })
  .addCase(deleteOptionsListAsync.rejected, (state, action) => {
    const res = action.payload as IDeleteOptionsListError;
    state.code = res.code;
    state.showModal = true;
    state.status = ApiStatus.failed;
  })
  }
});

export const { revertDeleteOptionsList } = deleteOptionsListSlice.actions;

export const deleteOptionsListStatus = (root: RootState) => root.deleteOptionsList.status;
export const deleteOptionsListShowModal = (root: RootState) => root.deleteOptionsList.showModal;
export const deleteOptionsListCode = (root: RootState) => root.deleteOptionsList.code;

export default deleteOptionsListSlice.reducer;