import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../../app/store";
import { ApiStatus, API_URL_COURSE, API_URL_USER } from "../../Utils";

interface ICourse {
  id: number;
  title: string;
}

interface IGetTeacherCoursesState {
  status: ApiStatus;
  courses: null | ICourse[];
  code: null | string;
}

const initialState: IGetTeacherCoursesState = {
  status: ApiStatus.idle,
  courses: null,
  code: null
}

interface IGetTeacherCoursesRequest {
  email: string;
}

interface IGetTeacherCoursesResponse {
  code: string;
  courses: ICourse[]; 
}

interface IGetTeacherCoursesError {
  code: string; 
}

export const getTeacherCoursesAsync = createAsyncThunk(
  'user/admin/getTeacherCourses',
  async (request: IGetTeacherCoursesRequest, {rejectWithValue}) => await axios
    .post(
      API_URL_COURSE + "/teacher/get_teacher_courses",
      request
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return rejectWithValue(error.response.data);
    })
)

export const getTeacherCoursesSlice = createSlice({
  name: 'getTeachers',
  initialState,
  reducers: {
    revertGetTeacherCourses: () => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(getTeacherCoursesAsync.pending, (state, action) => {
      state.status = ApiStatus.loading;
    })
    .addCase(getTeacherCoursesAsync.fulfilled, (state, action) => {
      const res = action.payload as IGetTeacherCoursesResponse;
      state.courses = res.courses;
      state.code = res.code;
      state.status = ApiStatus.success;
    })
    .addCase(getTeacherCoursesAsync.rejected, (state, action) => {
      const res = action.payload as IGetTeacherCoursesError;
      state.code = res.code;
      state.status = ApiStatus.failed;
    })
  }
});

export const { revertGetTeacherCourses } = getTeacherCoursesSlice.actions;

export const getTeacherCoursesStatus = (root: RootState) => root.getTeacherCourses.status;
export const getTeacherCoursesCode = (root: RootState) => root.getTeacherCourses.code;
export const getTeacherCoursesCourses = (root: RootState) => root.getTeacherCourses.courses;

export default getTeacherCoursesSlice.reducer;