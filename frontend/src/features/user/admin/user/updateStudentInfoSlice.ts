import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import axios from "axios";
import { ApiStatus, API_URL_USER } from "features/Utils";

interface IGrade {
  year: number;
  grade: number;
}

interface IUpdateStudentInfoState {
  status: ApiStatus;
  showModal: boolean;
  code: null | string;
}

const initialState: IUpdateStudentInfoState = {
  status: ApiStatus.idle,
  showModal: false,
  code: null
}

interface IUpdateStudentInfoRequest {
  email: string;
  first_name: string;
  last_name: string;
  domain: string;
  learning_mode: string;
  degree: string;
  study_program: string;
  current_group: string;
  current_year: number;
  grades: IGrade[];
  token: string;
}

interface IUpdateStudentInfoResponse {
  code: string; 
}

interface IUpdateStudentInfoError {
  code: string; 
}

export const updateStudentInfoAsync = createAsyncThunk(
  'user/admin/updateStudentInfo',
  async (request: IUpdateStudentInfoRequest, {rejectWithValue}) => await axios
  .post(
    API_URL_USER + "/admin/students",
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

export const updateStudentInfoSlice = createSlice({
  name: 'updateStudentInfo',
  initialState,
  reducers: {
  revertUpdateStudentInfo: () => {
    return initialState;
  }
  },
  extraReducers: (builder) => {
  builder
  .addCase(updateStudentInfoAsync.pending, (state) => {
    state.showModal = true;
    state.status = ApiStatus.loading;
  })
  .addCase(updateStudentInfoAsync.fulfilled, (state, action) => {
    const res = action.payload as IUpdateStudentInfoResponse;
    state.code = res.code;
    state.showModal = true;
    state.status = ApiStatus.success;
  })
  .addCase(updateStudentInfoAsync.rejected, (state, action) => {
    const res = action.payload as IUpdateStudentInfoError;
    state.code = res.code;
    state.showModal = true;
    state.status = ApiStatus.failed;
  })
  }
});

export const { revertUpdateStudentInfo } = updateStudentInfoSlice.actions;

export const updateStudentInfoStatus = (root: RootState) => root.updateStudentInfo.status;
export const updateStudentInfoShowModal = (root: RootState) => root.updateStudentInfo.showModal;
export const updateStudentInfoCode = (root: RootState) => root.updateStudentInfo.code;

export default updateStudentInfoSlice.reducer;