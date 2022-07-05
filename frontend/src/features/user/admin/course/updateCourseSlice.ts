import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../../../app/store";
import { ApiStatus, API_URL_COURSE } from "../../../Utils";

interface IUpdateCourseState {
  status: ApiStatus;
  showModal: boolean;
  code: null | string;
}

const initialState: IUpdateCourseState = {
  status: ApiStatus.idle,
  showModal: false,
  code: null
}

interface IUpdateCourseRequest {
  id: number;
  title: string;
  link: string;
  capacity: number;
  semester: number;
  teacher_email: string;
  token: string;
}

interface IUpdateCourseResponse {
  code: string; 
}

interface IUpdateCourseError {
  code: string; 
}

export const updateCourseAsync = createAsyncThunk(
  'user/admin/updateCourse',
  async (request: IUpdateCourseRequest, {rejectWithValue}) => await axios
  .post(
    API_URL_COURSE + "/admin/update_course",
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

export const updateCourseSlice = createSlice({
  name: 'updateCourse',
  initialState,
  reducers: {
  revertUpdateCourse: () => {
    return initialState;
  }
  },
  extraReducers: (builder) => {
  builder
  .addCase(updateCourseAsync.pending, (state, action) => {
    state.showModal = true;
    state.status = ApiStatus.loading;
  })
  .addCase(updateCourseAsync.fulfilled, (state, action) => {
    const res = action.payload as IUpdateCourseResponse;
    state.code = res.code;
    state.showModal = true;
    state.status = ApiStatus.success;
  })
  .addCase(updateCourseAsync.rejected, (state, action) => {
    const res = action.payload as IUpdateCourseError;
    state.code = res.code;
    state.showModal = true;
    state.status = ApiStatus.failed;
  })
  }
});

export const { revertUpdateCourse } = updateCourseSlice.actions;

export const updateCourseStatus = (root: RootState) => root.updateCourse.status;
export const updateCourseShowModal = (root: RootState) => root.updateCourse.showModal;
export const updateCourseCode = (root: RootState) => root.updateCourse.code;

export default updateCourseSlice.reducer; 