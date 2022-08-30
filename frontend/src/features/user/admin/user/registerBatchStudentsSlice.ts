import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import axios from "axios";
import { ApiStatus, API_URL_USER } from "features/Utils";

export interface IRegisterBatchStudentsState {
  status: ApiStatus;
  showModal: boolean;
  errorMessages: IErrorMessage[] | null;
  code: string | null;
}

const initialState: IRegisterBatchStudentsState = {
  status: ApiStatus.idle,
  showModal: false,
  errorMessages: null,
  code: null,
}

export interface IGrade {
  year: number;
  grade: number;
}

export interface IStudentData {
  first_name: string;
  last_name: string;
  email: string;
  domain: string;
  learning_mode: string;
  degree: string;
  study_program: string;
  current_group: string;
  current_year: number;
  grade1: number;
  grade2: number;
  grade3: number;
  grade4: number;
}

export interface IRegisterBatchStudentsRequest {
  students: IStudentData[];
  token: string;
}

export interface IErrorMessage {
  index: number;
  code: string;
}

export interface IRegisterBatchStudentsResponse {
  error_messages: IErrorMessage[];
  code: string;
}

interface IRegisterBatchStudentsError {
  code: string; 
}

export const registerBatchStudentsAsync = createAsyncThunk(
  'user/admin/registerBatchStudents',
  async (request: IRegisterBatchStudentsRequest, {rejectWithValue}) => await axios
  .post(
    API_URL_USER + "/admin/register_batch_students",
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

export const registerBatchStudentsSlice = createSlice({
  name: 'registerBatchStudents',
  initialState,
  reducers: {
  revertRegisterBatchStudents: () => {
    return initialState;
  }
  },
  extraReducers: (builder) => {
  builder
  .addCase(registerBatchStudentsAsync.pending, (state) => {
    state.status = ApiStatus.loading;
  })
  .addCase(registerBatchStudentsAsync.fulfilled, (state, action) => {
    const res = action.payload as IRegisterBatchStudentsResponse;
    state.code = res.code;
    state.errorMessages = res.error_messages;
    state.showModal = true;
    state.status = ApiStatus.success;
  })
  .addCase(registerBatchStudentsAsync.rejected, (state, action) => {
    const res = action.payload as IRegisterBatchStudentsError;
    state.code = res.code;
    state.showModal = true;
    state.status = ApiStatus.failed;
  })
  }
});

export const { revertRegisterBatchStudents } = registerBatchStudentsSlice.actions;

export const registerBatchStudentsStatus = (root: RootState) => root.registerBatchStudents.status;
export const registerBatchStudentsShowModal = (root: RootState) => root.registerBatchStudents.showModal;
export const registerBatchStudentsCode = (root: RootState) => root.registerBatchStudents.code;
export const registerBatchStudentsErrorMessages = (root: RootState) => root.registerBatchStudents.errorMessages;

export default registerBatchStudentsSlice.reducer;