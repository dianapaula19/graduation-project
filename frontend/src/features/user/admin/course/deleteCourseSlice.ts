import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../../../app/store";
import { ApiStatus, API_URL_COURSE } from "../../../Utils";

interface IDeleteCourseState {
  status: ApiStatus;
  showModal: boolean;
  code: null | string;
}

const initialState: IDeleteCourseState = {
  status: ApiStatus.idle,
  showModal: false,
  code: null
}

interface IDeleteCourseRequest {
  id: number;
  token: string;
}

interface IDeleteCourseResponse {
  code: string; 
}

interface IDeleteCourseError {
  code: string; 
}

export const deleteCourseAsync = createAsyncThunk(
  'user/admin/deleteCourse',
  async (
    request: IDeleteCourseRequest, 
    {rejectWithValue}
  ) => await axios
  .post(
    API_URL_COURSE + "/admin/delete_course",
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

export const deleteCourseSlice = createSlice({
  name: 'deleteCourse',
  initialState,
  reducers: {
  revertDeleteCourse: () => {
    return initialState;
  }
  },
  extraReducers: (builder) => {
  builder
  .addCase(deleteCourseAsync.pending, (state, action) => {
    state.showModal = true;
    state.status = ApiStatus.loading;
  })
  .addCase(deleteCourseAsync.fulfilled, (state, action) => {
    const res = action.payload as IDeleteCourseResponse;
    state.code = res.code;
    state.showModal = true;
    state.status = ApiStatus.success;
  })
  .addCase(deleteCourseAsync.rejected, (state, action) => {
    const res = action.payload as IDeleteCourseError;
    state.code = res.code;
    state.showModal = true;
    state.status = ApiStatus.failed;
  })
  }
});

export const { revertDeleteCourse } = deleteCourseSlice.actions;

export const deleteCourseStatus = (root: RootState) => root.deleteCourse.status;
export const deleteCourseShowModal = (root: RootState) => root.deleteCourse.showModal;
export const deleteCourseCode = (root: RootState) => root.deleteCourse.code;

export default deleteCourseSlice.reducer;