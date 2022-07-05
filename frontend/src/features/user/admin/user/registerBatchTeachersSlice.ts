import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../../../app/store";
import { ApiStatus, API_URL_USER } from "../../../Utils";

export interface IregisterBatchTeachersState {
  status: ApiStatus;
  showModal: boolean;
  errorMessages: string[] | null;
  code: string | null;
}

const initialState: IregisterBatchTeachersState = {
  status: ApiStatus.idle,
  showModal: false,
  errorMessages: null,
  code: null,
}

export interface ITeacherData {
  first_name: string;
  last_name: string;
  email: string;
}

export interface IRegisterBatchTeachersRequest {
  teachers: ITeacherData[];
  token: string;
}

export interface IRegisterBatchTeachersResponse {
  error_messages: string[];
  code: string;
}

export const registerBatchTeachersAsync = createAsyncThunk(
  'user/admin/registerBatchTeachers',
  async (request: IRegisterBatchTeachersRequest, {rejectWithValue}) => await axios
  .post(
    API_URL_USER + "/admin/register_batch_teachers",
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

export const registerBatchTeachersSlice = createSlice({
  name: 'registerBatchTeachers',
  initialState,
  reducers: {
  revertRegisterBatchTeachers: () => {
    return initialState;
  }
  },
  extraReducers: (builder) => {
  builder
  .addCase(registerBatchTeachersAsync.pending, (state, action) => {
    state.status = ApiStatus.loading;
  })
  .addCase(registerBatchTeachersAsync.fulfilled, (state, action) => {
    const res = action.payload as IRegisterBatchTeachersResponse;
    state.code = res.code;
    state.errorMessages = res.error_messages;
    state.showModal = true;
    state.status = ApiStatus.success;
  })
  }
});

export const { revertRegisterBatchTeachers } = registerBatchTeachersSlice.actions;

export const registerBatchTeachersStatus = (root: RootState) => root.registerBatchTeachers.status;
export const registerBatchTeachersShowModal = (root: RootState) => root.registerBatchTeachers.showModal;
export const registerBatchTeachersCode = (root: RootState) => root.registerBatchTeachers.code;
export const registerBatchTeachersErrorMessages = (root: RootState) => root.registerBatchTeachers.errorMessages;

export default registerBatchTeachersSlice.reducer;