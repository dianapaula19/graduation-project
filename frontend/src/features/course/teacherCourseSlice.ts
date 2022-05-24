import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { act } from "react-dom/test-utils";
import { RootState } from "../../app/store";
import { ApiStatus, API_URL_COURSE } from "../Utils";

export interface ICourseResponse {
  model: string;
  pk: number;
  fields: {
    title: string;
    link: string;
    capacity: number;
  }
}

export interface ICourse {
  title: string;
  link: string;
  capacity: number;
}

export interface ICoursesTeacherState {
  teacherCourses: null | ICourse[];
  message: null | string;
  status: ApiStatus;
}

const initialState: ICoursesTeacherState = {
  teacherCourses: null,
  message: null,
  status: ApiStatus.idle
}

export interface IGetCourseTeacherResponse {
  courses: ICourseResponse[]
}

export interface IGetCourseTeacherError {
  error: string;
}

export const getCoursesTeacherAsync = createAsyncThunk(
  'course/courses_teacher',
  async (email: string) => await axios
    .post(
      API_URL_COURSE + "/teacher_courses",
      {email: email}
    )
    .then((response) => {
      return response.data as ICourseResponse[];
    })
    .catch((response) => {
      return response.data as IGetCourseTeacherError;
    })
)

export const teacherCoursesSlice = createSlice({
  name: 'teacherCourses',
  initialState: initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
    .addCase(getCoursesTeacherAsync.pending, (state, action) => {
      console.log(action.payload)
      state.status = ApiStatus.loading
    })
    .addCase(getCoursesTeacherAsync.fulfilled, (state, action) => {
      const res = action.payload as ICourseResponse[];
      // state.teacherCourses = res.courses.map((course) => {
      //   return {
      //     title: course.fields.title,
      //     link: course.fields.link,
      //     capacity: course.fields.capacity  
      //   } as ICourse
      // });
      console.log(res);
      state.status = ApiStatus.success;
    })
    .addCase(getCoursesTeacherAsync.rejected, (state, action) => {
      const res = action.payload as IGetCourseTeacherError;
      state.message = res.error;
      state.status = ApiStatus.failed;
    })
  }
})

export const teacherCoursesStatus = (state: RootState) => state.teacherCourse.status;
export const teacherCourses = (state: RootState) => state.teacherCourse.teacherCourses;

export default teacherCoursesSlice.reducer;