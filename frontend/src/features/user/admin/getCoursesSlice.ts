import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../../app/store";
import { ApiStatus, API_URL_COURSE } from "../../Utils";

interface ICourse {
  id: number;
  title: string;
  capacity: number;
  link: string;
  teacher_email: string;
  teacher_first_name: string;
  teacher_last_name: string;
}

interface IGetCoursesState {
  status: ApiStatus;
  courses: null | ICourse[];
  currentCourse: null | ICourse;
  code: null | string;
}

const initialState: IGetCoursesState = {
  status: ApiStatus.idle,
  courses: null,
  currentCourse: null,
  code: null
}

interface ICreateOptionsListResponse {
  code: string;
  courses: ICourse[]; 
}

interface ICreateOptionsListError {
  code: string; 
}

interface IGetCurrentCoursePayload {
  id: number;
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
  name: 'getCourses',
  initialState,
  reducers: {
    revertGetCourses: () => {
      return initialState;
    },
    getCurrentCourse: (
      state: IGetCoursesState, 
      action: PayloadAction<IGetCurrentCoursePayload>
    ) => {
      const res = action.payload;
      if (state.courses) {
        state.currentCourse = state.courses.filter((course) => course.id === res.id)[0];
      }
      return state;
    },
    revertCurrentCourse: (state: IGetCoursesState) => {
      state.currentCourse = null;
      return state;
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

export const { revertGetCourses, getCurrentCourse, revertCurrentCourse } = getCoursesSlice.actions;

export const getCoursesStatus = (root: RootState) => root.getCourses.status;
export const getCoursesCode = (root: RootState) => root.getCourses.code;
export const getCoursesCourses = (root: RootState) => root.getCourses.courses;
export const getCoursesCurrentCourse = (root: RootState) => root.getCourses.currentCourse;

export default getCoursesSlice.reducer;