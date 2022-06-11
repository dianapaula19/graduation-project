import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../../app/store";
import { ApiStatus, API_URL_COURSE } from "../../Utils";

interface ICourse {
  id: number;
  title: string;
  capacity: number;
  semester: number;
  link: string;
  teacher_email: string;
  teacher_first_name: string;
  teacher_last_name: string;
}

interface IGetStudentCoursesState {
  status: ApiStatus;
  courses: null | ICourse[];
  code: null | string;
}

const initialState: IGetStudentCoursesState = {
  status: ApiStatus.idle,
  courses: null,
  code: null
}

interface IGetStudentCoursesRequest {
  email: string;
}

interface IGetStudentCoursesResponse {
  code: string;
  courses: ICourse[]; 
}

interface IGetStudentCoursesError {
  code: string; 
}

export const getStudentCoursesAsync = createAsyncThunk(
  'user/admin/getStudentCourses',
  async (request: IGetStudentCoursesRequest, {rejectWithValue}) => await axios
  .post(
    API_URL_COURSE + "/student/get_student_course",
    request
  )
  .then((response) => {
    return response.data;
  })
  .catch((error) => {
    return rejectWithValue(error.response.data);
  })
)

export const getStudentCoursesSlice = createSlice({
  name: 'getStudentCourses',
  initialState,
  reducers: {
    revertGetStudentCourses: () => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
  builder
  .addCase(getStudentCoursesAsync.pending, (state, action) => {
    state.status = ApiStatus.loading;
  })
  .addCase(getStudentCoursesAsync.fulfilled, (state, action) => {
    const res = action.payload as IGetStudentCoursesResponse;
    state.courses = res.courses;
    state.code = res.code;
    state.status = ApiStatus.success;
  })
  .addCase(getStudentCoursesAsync.rejected, (state, action) => {
    const res = action.payload as IGetStudentCoursesError;
    state.code = res.code;
    state.status = ApiStatus.failed;
  })
  }
});

export const { revertGetStudentCourses } = getStudentCoursesSlice.actions;

export const getStudentCoursesStatus = (root: RootState) => root.getStudentCourses.status;
export const getStudentCoursesCode = (root: RootState) => root.getStudentCourses.code;
export const getStudentCoursesCourses = (root: RootState) => root.getStudentCourses.courses;

export default getStudentCoursesSlice.reducer;