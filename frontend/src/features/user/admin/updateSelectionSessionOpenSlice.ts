import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import axios from "axios";
import { ApiStatus, SelectionSessionSettingValue, API_URL_USER } from "features/Utils";

interface IUpdateSelectionSessionOpenState {
  status: ApiStatus;
  showModal: boolean;
  code: null | string;
}

const initialState: IUpdateSelectionSessionOpenState = {
  status: ApiStatus.idle,
  showModal: false,
  code: null
}

interface IUpdateSelectionSessionOpenRequest {
  value: SelectionSessionSettingValue;
  token: string;
}

interface IUpdateSelectionSessionOpenResponse {
  code: string; 
}

interface IUpdateSelectionSessionOpenError {
  code: string; 
}

export const updateSelectionSessionOpenAsync = createAsyncThunk(
  'user/admin/updateSelectionSessionOpen',
  async (request: IUpdateSelectionSessionOpenRequest, {rejectWithValue}) => await axios
  .post(
    API_URL_USER + "/admin/update_selection_session_open",
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

export const updateSelectionSessionOpenSlice = createSlice({
  name: 'updateSelectionSessionOpen',
  initialState,
  reducers: {
    revertUpdateSelectionSessionOpen: () => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
  builder
  .addCase(updateSelectionSessionOpenAsync.pending, (state, action) => {
    state.status = ApiStatus.loading;
  })
  .addCase(updateSelectionSessionOpenAsync.fulfilled, (state, action) => {
    const res = action.payload as IUpdateSelectionSessionOpenResponse;
    state.code = res.code;
    state.showModal = true;
    state.status = ApiStatus.success;
  })
  .addCase(updateSelectionSessionOpenAsync.rejected, (state, action) => {
    const res = action.payload as IUpdateSelectionSessionOpenError;
    state.code = res.code;
    state.showModal = true;
    state.status = ApiStatus.failed;
  })
  }
});

export const { revertUpdateSelectionSessionOpen } = updateSelectionSessionOpenSlice.actions;

export const updateSelectionSessionOpenStatus = (root: RootState) => root.updateSelectionSessionOpen.status;
export const updateSelectionSessionOpenShowModal = (root: RootState) => root.updateSelectionSessionOpen.showModal;
export const updateSelectionSessionOpenCode = (root: RootState) => root.updateSelectionSessionOpen.code;

export default updateSelectionSessionOpenSlice.reducer; 