import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import axios from "axios";
import { Degree } from "components/App";
import { ApiStatus, API_URL_COURSE } from "features/Utils";

interface ICreateCourseState {
  status: ApiStatus;
  showModal: boolean;
  code: null | string;
}

const initialState: ICreateCourseState = {
  status: ApiStatus.idle,
  showModal: false,
  code: null
}

interface ICreateCourseRequest {
  title: string;
  link: string;
  capacity: number;
  degree: string | Degree;
  semester: number;
  teacher_email: string;
  token: string;
}

interface ICreateCourseResponse {
  code: string; 
}

interface ICreateCourseError {
  code: string; 
}

export const createCourseAsync = createAsyncThunk(
  'user/admin/createCourse',
  async (request: ICreateCourseRequest, {rejectWithValue}) => await axios
  .post(
    API_URL_COURSE + "/admin/create_course",
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

export const createCourseSlice = createSlice({
  name: 'createCourse',
  initialState,
  reducers: {
  revertCreateCourse: () => {
    return initialState;
  }
  },
  extraReducers: (builder) => {
  builder
  .addCase(createCourseAsync.pending, (state) => {
    state.showModal = true;
    state.status = ApiStatus.loading;
  })
  .addCase(createCourseAsync.fulfilled, (state, action) => {
    const res = action.payload as ICreateCourseResponse;
    state.code = res.code;
    state.showModal = true;
    state.status = ApiStatus.success;
  })
  .addCase(createCourseAsync.rejected, (state, action) => {
    const res = action.payload as ICreateCourseError;
    state.code = res.code;
    state.showModal = true;
    state.status = ApiStatus.failed;
  })
  }
});

export const { revertCreateCourse } = createCourseSlice.actions;

export const createCourseStatus = (root: RootState) => root.createCourse.status;
export const createCourseShowModal = (root: RootState) => root.createCourse.showModal;
export const createCourseCode = (root: RootState) => root.createCourse.code;

export default createCourseSlice.reducer; 