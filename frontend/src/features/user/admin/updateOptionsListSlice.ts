import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../../app/store";
import { ApiStatus, API_URL_COURSE } from "../../Utils";

interface IUpdateOptionsListState {
  status: ApiStatus;
  showModal: boolean;
  code: null | string;
}

const initialState: IUpdateOptionsListState = {
  status: ApiStatus.idle,
  showModal: false,
  code: null
}

interface IUpdateOptionsListRequest {
  id: number;
  domain: string;
  learning_mode: string;
  degree: string;
  study_program: string;
  year: number;
  semester: number;
  title: string;
  courses_ids: number[];
  token: string;
}

interface IUpdateOptionsListResponse {
  code: string; 
}

interface IUpdateOptionsListError {
  code: string; 
}

export const updateOptionsListAsync = createAsyncThunk(
  'user/admin/updateOptionsList',
  async (request: IUpdateOptionsListRequest, {rejectWithValue}) => await axios
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

export const updateOptionsListSlice = createSlice({
  name: 'updateOptionsList',
  initialState,
  reducers: {
  revertUpdateOptionsList: () => {
    return initialState;
  }
  },
  extraReducers: (builder) => {
  builder
  .addCase(updateOptionsListAsync.pending, (state, action) => {
    state.status = ApiStatus.loading;
  })
  .addCase(updateOptionsListAsync.fulfilled, (state, action) => {
    const res = action.payload as IUpdateOptionsListResponse;
    state.code = res.code;
    state.showModal = true;
    state.status = ApiStatus.success;
  })
  .addCase(updateOptionsListAsync.rejected, (state, action) => {
    const res = action.payload as IUpdateOptionsListError;
    state.code = res.code;
    state.showModal = true;
    state.status = ApiStatus.failed;
  })
  }
});

export const { revertUpdateOptionsList } = updateOptionsListSlice.actions;

export const updateOptionsListStatus = (root: RootState) => root.updateOptionsList.status;
export const updateOptionsListShowModal = (root: RootState) => root.updateOptionsList.showModal;
export const updateOptionsListCode = (root: RootState) => root.updateOptionsList.code;

export default updateOptionsListSlice.reducer; 