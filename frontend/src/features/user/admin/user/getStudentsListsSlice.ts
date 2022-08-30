import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import axios from "axios";
import { ApiStatus, API_URL_USER } from "features/Utils";

interface IStudent {
  first_name: string;
  last_name: string;
  current_group: string;
}

interface IStudentsList {
  course: string;
  domain: string;
  degree: string;
  learning_mode: string;
  study_program: string;
  year: number;
  students: IStudent[]
}

interface IGetStudentsListsState {
  status: ApiStatus;
  lists: null | IStudentsList[];
  code: null | string;
}

const initialState: IGetStudentsListsState = {
  status: ApiStatus.idle,
  lists: null,
  code: null
}

interface IGetStudentsListsRequest {
  token: string;
}

interface IGetStudentsListsResponse {
  code: string;
  lists: IStudentsList[]; 
}

interface IGetStudentsListsError {
  code: string; 
}

export const getStudentsListsAsync = createAsyncThunk(
  'user/admin/getStudentsLists',
  async (request: IGetStudentsListsRequest, {rejectWithValue}) => await axios
  .get(
    API_URL_USER + "/admin/get_students_lists",
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

export const getStudentsListsSlice = createSlice({
  name: 'getStudentsLists',
  initialState,
  reducers: {
    revertGetStudentsLists: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
  builder
  .addCase(getStudentsListsAsync.pending, (state) => {
    state.status = ApiStatus.loading;
  })
  .addCase(getStudentsListsAsync.fulfilled, (state, action) => {
    const res = action.payload as IGetStudentsListsResponse;
    state.lists = res.lists;
    state.code = res.code;
    state.status = ApiStatus.success;
  })
  .addCase(getStudentsListsAsync.rejected, (state, action) => {
    const res = action.payload as IGetStudentsListsError;
    state.code = res.code;
    state.status = ApiStatus.failed;
  })
  }
});

export const { revertGetStudentsLists } = getStudentsListsSlice.actions;

export const getStudentsListsStatus = (root: RootState) => root.getStudentsLists.status;
export const getStudentsListsCode = (root: RootState) => root.getStudentsLists.code;
export const getStudentsListsLists = (root: RootState) => root.getStudentsLists.lists;

export default getStudentsListsSlice.reducer;