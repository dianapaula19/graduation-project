import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../../app/store";
import { ApiStatus, API_URL_COURSE, API_URL_USER } from "../../Utils";

interface IStudent {
  email: string;
  first_name: string;
  last_name: string;
}
interface ICourse {
  id: number;
  title: string;
  students: IStudent[];
}

interface IGetTeacherCoursesState {
  status: ApiStatus;
  courses: null | ICourse[];
  currentCourse: null | ICourse;
  code: null | string;
}

const initialState: IGetTeacherCoursesState = {
  status: ApiStatus.idle,
  currentCourse: null,
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

interface IGetCurrentCoursePayload {
  id: number;
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
  name: 'getTeacherCourses',
  initialState,
  reducers: {
    revertGetTeacherCourses: () => {
      return initialState;
    },
    getCurrentTeacherCourse: (state: IGetTeacherCoursesState, action: PayloadAction<IGetCurrentCoursePayload>) => {
      const res = action.payload;
      if (state.courses) {
        state.currentCourse = state.courses.filter((course) => course.id === res.id)[0];
      }
      return state;
    },
    revertCurrentTeacherCourse: (state: IGetTeacherCoursesState) => {
      state.currentCourse = null;
      return state;
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

export const { revertGetTeacherCourses, getCurrentTeacherCourse } = getTeacherCoursesSlice.actions;

export const getTeacherCoursesStatus = (root: RootState) => root.getTeacherCourses.status;
export const getTeacherCoursesCode = (root: RootState) => root.getTeacherCourses.code;
export const getTeacherCoursesCourses = (root: RootState) => root.getTeacherCourses.courses;
export const getTeacherCoursesCurrentCourse = (root: RootState) => root.getTeacherCourses.currentCourse;

export default getTeacherCoursesSlice.reducer;