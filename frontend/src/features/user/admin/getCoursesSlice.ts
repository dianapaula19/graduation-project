import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../../app/store";
import { ApiStatus, API_URL_COURSE } from "../../Utils";

interface Course {
  title: string;
  id: number;
}

interface IGetCoursesState {
  status: ApiStatus;
  courses: null | Course[];
  code: null | string;
}

const initialState: IGetCoursesState = {
  status: ApiStatus.idle,
  courses: null,
  code: null
}

interface ICreateOptionsListResponse {
  code: string;
  courses: Course[]; 
}

interface ICreateOptionsListError {
  code: string; 
}

export const getCoursesAsync = createAsyncThunk(
  'user/admin/getCourses',
  async (request, {rejectWithValue}) => await axios
    .get(
      API_URL_COURSE + "/admin/get_courses",
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return rejectWithValue(error.response.data);
    })
)

export const getCoursesSlice = createSlice({
  name: 'createOptionsList',
  initialState,
  reducers: {
    revertCreateOptionsList: () => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(getCoursesAsync.pending, (state, action) => {
      state.status = ApiStatus.loading;
    })
    .addCase(getCoursesAsync.fulfilled, (state, action) => {
      const res = action.payload as ICreateOptionsListResponse;
      state.courses = res.courses;
      state.code = res.code;
      state.status = ApiStatus.success;
    })
    .addCase(getCoursesAsync.rejected, (state, action) => {
      const res = action.payload as ICreateOptionsListError;
      state.code = res.code;
      state.status = ApiStatus.failed;
    })
  }
});

export const getCoursesStatus = (root: RootState) => root.getCourses.status;
export const getCoursesCode = (root: RootState) => root.getCourses.code;
export const getCoursesCourses = (root: RootState) => root.getCourses.courses;

export default getCoursesSlice.reducer;