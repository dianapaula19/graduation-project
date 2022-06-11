import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../../app/store";
import { ApiStatus, API_URL_COURSE, API_URL_USER } from "../../Utils";

interface IGrade {
  year: number;
  grade: number;
}

interface IUpdateTeacherInfoState {
  status: ApiStatus;
  showModal: boolean;
  code: null | string;
}

const initialState: IUpdateTeacherInfoState = {
  status: ApiStatus.idle,
  showModal: false,
  code: null
}

interface IUpdateTeacherInfoRequest {
  first_name: string;
  last_name: string;
}

interface IUpdateTeacherInfoResponse {
  code: string; 
}

interface IUpdateTeacherInfoError {
  code: string; 
}

export const updateTeacherInfoAsync = createAsyncThunk(
  'user/admin/updateTeacherInfo',
  async (request: IUpdateTeacherInfoRequest, {rejectWithValue}) => await axios
  .post(
    API_URL_USER + "/admin/teachers",
    request
  )
  .then((response) => {
    return response.data;
  })
  .catch((error) => {
    return rejectWithValue(error.response.data);
  })
)

export const updateTeacherInfoSlice = createSlice({
  name: 'updateTeacherInfo',
  initialState,
  reducers: {
  revertUpdateTeacherInfo: () => {
    return initialState;
  }
  },
  extraReducers: (builder) => {
  builder
  .addCase(updateTeacherInfoAsync.pending, (state, action) => {
    state.status = ApiStatus.loading;
  })
  .addCase(updateTeacherInfoAsync.fulfilled, (state, action) => {
    const res = action.payload as IUpdateTeacherInfoResponse;
    state.code = res.code;
    state.showModal = true;
    state.status = ApiStatus.success;
  })
  .addCase(updateTeacherInfoAsync.rejected, (state, action) => {
    const res = action.payload as IUpdateTeacherInfoError;
    state.code = res.code;
    state.showModal = true;
    state.status = ApiStatus.failed;
  })
  }
});

export const { revertUpdateTeacherInfo } = updateTeacherInfoSlice.actions;

export const updateTeacherInfoStatus = (root: RootState) => root.updateTeacherInfo.status;
export const updateTeacherInfoShowModal = (root: RootState) => root.updateTeacherInfo.showModal;
export const updateTeacherInfoCode = (root: RootState) => root.updateTeacherInfo.code;

export default updateTeacherInfoSlice.reducer;