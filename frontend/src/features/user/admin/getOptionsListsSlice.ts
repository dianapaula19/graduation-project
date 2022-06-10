import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../../app/store";
import { ApiStatus, API_URL_COURSE } from "../../Utils";

interface ICourse {
  id: number;
}

interface IOptionsList {
  id: number;
  domain: string;
  learning_mode: string;
  degree: string;
  study_program: string;
  year: number;
  semester: number;
  title: string;
  courses: ICourse[];
}

interface IGetOptionsListsState {
  status: ApiStatus;
  optionsLists: null | IOptionsList[];
  currentOptionsList: null | IOptionsList;
  code: null | string;
}

const initialState: IGetOptionsListsState = {
  status: ApiStatus.idle,
  optionsLists: null,
  currentOptionsList: null,
  code: null
}

interface ICreateOptionsListResponse {
  code: string;
  options_lists: IOptionsList[]; 
}

interface ICreateOptionsListError {
  code: string; 
}

interface IGetCurrentCoursePayload {
  id: number;
}

export const getOptionsListsAsync = createAsyncThunk(
  'user/admin/getOptionsLists',
  async (request, {rejectWithValue}) => await axios
    .get(
      API_URL_COURSE + "/admin/get_options_lists",
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return rejectWithValue(error.response.data);
    })
)

export const getOptionsListsSlice = createSlice({
  name: 'getOptionsLists',
  initialState,
  reducers: {
    revertGetOptionsLists: () => {
      return initialState;
    },
    getCurrentOptionsList: (
      state: IGetOptionsListsState, 
      action: PayloadAction<IGetCurrentCoursePayload>
    ) => {
      const res = action.payload;
      if (state.optionsLists) {
        state.currentOptionsList = state.optionsLists.filter((optionsList) => optionsList.id === res.id)[0];
      }
      return state;
    },
    revertCurrentOptionsList: (state: IGetOptionsListsState) => {
      state.currentOptionsList = null;
      return state;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(getOptionsListsAsync.pending, (state, action) => {
      state.status = ApiStatus.loading;
    })
    .addCase(getOptionsListsAsync.fulfilled, (state, action) => {
      const res = action.payload as ICreateOptionsListResponse;
      state.optionsLists = res.options_lists;
      state.code = res.code;
      state.status = ApiStatus.success;
    })
    .addCase(getOptionsListsAsync.rejected, (state, action) => {
      const res = action.payload as ICreateOptionsListError;
      state.code = res.code;
      state.status = ApiStatus.failed;
    })
  }
});

export const { revertGetOptionsLists, getCurrentOptionsList, revertCurrentOptionsList } = getOptionsListsSlice.actions;

export const getOptionsListsStatus = (root: RootState) => root.getOptionsLists.status;
export const getOptionsListsCode = (root: RootState) => root.getOptionsLists.code;
export const getOptionsListsOptionsLists = (root: RootState) => root.getOptionsLists.optionsLists;
export const getOptionsListsCurrentOptionsList = (root: RootState) => root.getOptionsLists.currentOptionsList;

export default getOptionsListsSlice.reducer;