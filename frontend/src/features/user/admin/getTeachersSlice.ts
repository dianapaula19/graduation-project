import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../../app/store";
import { ApiStatus, API_URL_COURSE, API_URL_USER } from "../../Utils";

interface ICourse {
  title: string;
  id: number;
}

interface ITeacher {
  first_name: string;
  last_name: string;
  email: string;
  courses: ICourse[];
}

interface IGetTeachersState {
  status: ApiStatus;
  teachers: null | ITeacher[];
  currentTeacher: null | ITeacher;
  code: null | string;
}

const initialState: IGetTeachersState = {
  status: ApiStatus.idle,
  teachers: null,
  currentTeacher: null,
  code: null
}

interface IGetTeachersRequest {
  token: string;
}

interface IGetTeachersResponse {
  code: string;
  teachers: ITeacher[]; 
}

interface IGetTeachersError {
  code: string; 
}

interface IGetCurrentTeacherPayload {
  email: string;
}

export const getTeachersAsync = createAsyncThunk(
  'user/admin/getTeachers',
  async (request: IGetTeachersRequest, {rejectWithValue}) => await axios
  .get(
    API_URL_USER + "/admin/teachers",
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

export const getTeachersSlice = createSlice({
  name: 'getTeachers',
  initialState,
  reducers: {
  revertGetTeachers: () => {
    return initialState;
  },
  getCurrentTeacher: (state: IGetTeachersState, action: PayloadAction<IGetCurrentTeacherPayload>) => {
    const res = action.payload;
    if (state.teachers) {
    state.currentTeacher = state.teachers.filter((teacher) => teacher.email === res.email)[0];
    }
    return state;
  },
  revertCurrentTeacher: (state: IGetTeachersState) => {
    state.currentTeacher = null;
    return state;
  }
  },
  extraReducers: (builder) => {
  builder
  .addCase(getTeachersAsync.pending, (state, action) => {
    state.status = ApiStatus.loading;
  })
  .addCase(getTeachersAsync.fulfilled, (state, action) => {
    const res = action.payload as IGetTeachersResponse;
    state.teachers = res.teachers;
    state.code = res.code;
    state.status = ApiStatus.success;
  })
  .addCase(getTeachersAsync.rejected, (state, action) => {
    const res = action.payload as IGetTeachersError;
    state.code = res.code;
    state.status = ApiStatus.failed;
  })
  }
});

export const { revertGetTeachers, getCurrentTeacher, revertCurrentTeacher } = getTeachersSlice.actions;

export const getTeachersStatus = (root: RootState) => root.getTeachers.status;
export const getTeachersCode = (root: RootState) => root.getTeachers.code;
export const getTeachersTeachers = (root: RootState) => root.getTeachers.teachers;
export const getTeachersCurrentTeacher = (root: RootState) => root.getTeachers.currentTeacher;

export default getTeachersSlice.reducer;