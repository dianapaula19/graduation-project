import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import axios from "axios";
import { LearningMode, Degree, StudyProgram } from "components/App";
import { Domain } from "domain";
import { ApiStatus, API_URL_COURSE } from "features/Utils";

interface ICreateOptionsListState {
  status: ApiStatus;
  showModal: boolean;
  code: null | string;
}

const initialState: ICreateOptionsListState = {
  status: ApiStatus.idle,
  showModal: false,
  code: null
}

interface ICreateOptionsListRequest {
  title: string;
  year: number;
  semester: number;
  domain: string | Domain;
  learning_mode: string | LearningMode;
  degree: string | Degree;
  study_program: string | StudyProgram;
  courses_ids: number[];
  token: string;
}

interface ICreateOptionsListResponse {
  code: string; 
}

interface ICreateOptionsListError {
  code: string; 
}

export const createOptionsListAsync = createAsyncThunk(
  'user/admin/createOptionsList',
  async (request: ICreateOptionsListRequest, {rejectWithValue}) => await axios
  .post(
    API_URL_COURSE + "/admin/create_options_list",
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

export const createOptionsListSlice = createSlice({
  name: 'createOptionsList',
  initialState,
  reducers: {
  revertCreateOptionsList: () => {
    return initialState;
  }
  },
  extraReducers: (builder) => {
  builder
  .addCase(createOptionsListAsync.pending, (state, action) => {
    state.showModal = true;
    state.status = ApiStatus.loading;
  })
  .addCase(createOptionsListAsync.fulfilled, (state, action) => {
    const res = action.payload as ICreateOptionsListResponse;
    state.code = res.code;
    state.showModal = true;
    state.status = ApiStatus.success;
  })
  .addCase(createOptionsListAsync.rejected, (state, action) => {
    const res = action.payload as ICreateOptionsListError;
    state.code = res.code;
    state.showModal = true;
    state.status = ApiStatus.failed;
  })
  }
});

export const { revertCreateOptionsList } = createOptionsListSlice.actions;

export const createOptionsListStatus = (root: RootState) => root.createOptionsList.status;
export const createOptionsListShowModal = (root: RootState) => root.createOptionsList.showModal;
export const createOptionsListCode = (root: RootState) => root.createOptionsList.code;

export default createOptionsListSlice.reducer;