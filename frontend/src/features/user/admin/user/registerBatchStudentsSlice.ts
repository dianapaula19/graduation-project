import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../../../app/store";
import { ApiStatus, API_URL_USER } from "../../../Utils";

export interface IRegisterBatchStudentsState {
  status: ApiStatus;
  showModal: boolean;
  errorMessages: string[] | null;
  code: string | null;
}

const initialState: IRegisterBatchStudentsState = {
  status: ApiStatus.idle,
  showModal: false,
  errorMessages: null,
  code: null,
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
}

export interface IRegisterBatchStudentsRequest {
  students: IStudentData[];
  token: string;
}

export interface IRegisterBatchStudentsResponse {
  error_messages: string[];
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
  .addCase(registerBatchStudentsAsync.pending, (state, action) => {
    state.status = ApiStatus.loading;
  })
  .addCase(registerBatchStudentsAsync.fulfilled, (state, action) => {
    const res = action.payload as IRegisterBatchStudentsResponse;
    state.code = res.code;
    state.errorMessages = res.error_messages;
    state.showModal = true;
    state.status = ApiStatus.success;
  })
  }
});

export const { revertRegisterBatchStudents } = registerBatchStudentsSlice.actions;

export const registerBatchStudentsStatus = (root: RootState) => root.registerBatchStudents.status;
export const registerBatchStudentsShowModal = (root: RootState) => root.registerBatchStudents.showModal;
export const registerBatchStudentsCode = (root: RootState) => root.registerBatchStudents.code;
export const registerBatchStudentsErrorMessages = (root: RootState) => root.registerBatchStudents.errorMessages;

export default registerBatchStudentsSlice.reducer;