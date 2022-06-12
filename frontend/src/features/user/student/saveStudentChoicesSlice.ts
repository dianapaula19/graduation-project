import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../../app/store";
import { ApiStatus, API_URL_COURSE } from "../../Utils";


export interface Choice {
  course_id: number;
  order: number;
}

export interface SaveStudentChoicesState {
  status: ApiStatus;
  showModal: boolean;
  code: null | string;
}

const initialState: SaveStudentChoicesState = {
  status: ApiStatus.idle,
  showModal: false,
  code: null
}

export interface ISaveStudentChoicesRequest {
  options_list_id: number;
  email: string;
  token: string;
  choices: Choice[];
}

export interface ISaveStudentChoicesResponse {
  code: string;
}

export interface ISaveStudentChoicesError {
  code: string;
}

export const saveStudentChoicesAsync = createAsyncThunk(
  'user/student/saveStudentChoices',
  async (request: ISaveStudentChoicesRequest, {rejectWithValue}) => await axios
  .post(
    API_URL_COURSE + "/student/create_or_update_student_choices",
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

export const saveStudentChoicesSlice = createSlice({
  name: 'saveStudentChoices',
  initialState,
  reducers: {
  revertSaveStudentChoices: () => {
    return initialState;
  }
  },
  extraReducers: (builder) => {
  builder
  .addCase(saveStudentChoicesAsync.pending, (state, action) => {
    state.status = ApiStatus.loading;
  })
  .addCase(saveStudentChoicesAsync.fulfilled, (state, action) => {
    const res = action.payload as ISaveStudentChoicesResponse;
    state.code = res.code;
    state.showModal = true;
    state.status = ApiStatus.success;
  })
  .addCase(saveStudentChoicesAsync.rejected, (state, action) => {
    const res = action.payload as ISaveStudentChoicesError;
    state.code = res.code;
    state.showModal = true;
    state.status = ApiStatus.failed;
  })
  }
});

export const { revertSaveStudentChoices } = saveStudentChoicesSlice.actions;

export const saveStudentChoicesStatus = (root: RootState) => root.saveStudentChoices.status;
export const saveStudentChoicesShowModal = (root: RootState) => root.saveStudentChoices.showModal;
export const saveStudentChoicesCode = (root: RootState) => root.saveStudentChoices.code;

export default saveStudentChoicesSlice.reducer;
