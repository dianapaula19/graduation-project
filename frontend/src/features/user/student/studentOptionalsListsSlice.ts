import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../../app/store";
import { ApiStatus, API_URL_COURSE, API_URL_USER } from "../../Utils";

export interface Course {
  id: number;
  title: string;
  link: string;
  capacity: number;
  teacher_first_name: string;
  teacher_last_name: string;
  teacher_email: string;
}

export interface OptionsList {
  id: number;
  title: string;
  semester: number;
  courses: Course[];
}

export interface StudentOptionalsListsState {
  studentOptionsLists: null | OptionsList[];
  code: null | string;
  status: ApiStatus;
}

const initialState: StudentOptionalsListsState = {
  studentOptionsLists: null,
  code: null, 
  status: ApiStatus.idle
}

export interface IStudentOptionalsListsRequest {
  email: string;
}

export interface IStudentOptionalsListsResponse {
  student_options_lists: OptionsList[];
}

export const studentOptionalsListsAsync = createAsyncThunk(
  'user/student/optionalsLists',
  async (request: IStudentOptionalsListsRequest, {rejectWithValue}) => await axios
    .post(
      API_URL_COURSE + "/student/get_student_options_lists",
      request,
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return rejectWithValue(error.response.data);
    })
)

export const studentOptionalsListsSlice = createSlice({
  name: 'studentOptionalsLists',
  initialState,
  reducers: {
    revertStudentOptionalsLists: () => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(studentOptionalsListsAsync.pending, (state) => {
      state.status = ApiStatus.loading;
    })
    .addCase(studentOptionalsListsAsync.fulfilled, (state, action) => {
      const res = action.payload as IStudentOptionalsListsResponse;
      state.studentOptionsLists = res.student_options_lists;
      state.status = ApiStatus.success;
    })
    .addCase(studentOptionalsListsAsync.rejected, (state, action) => {
      state.status = ApiStatus.failed;
    })
  }
});

export const { revertStudentOptionalsLists } = studentOptionalsListsSlice.actions;

export const studentOptionalsListsStatus = (state: RootState) => state.studentOptionalsLists.status;
export const studentOptionalsLists = (state: RootState) => state.studentOptionalsLists.studentOptionsLists;

export default studentOptionalsListsSlice.reducer;