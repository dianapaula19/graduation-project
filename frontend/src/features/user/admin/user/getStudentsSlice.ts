import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import axios from "axios";
import { ApiStatus, API_URL_USER } from "features/Utils";

interface IGrade {
  year: number;
  grade: number;
}

interface IStudent {
  email: string;
  first_name: string;
  last_name: string;
  domain: string;
  learning_mode: string;
  degree: string;
  study_program: string;
  current_group: string;
  current_year: number;
  grades: IGrade[];
}

interface IGetStudentsState {
  status: ApiStatus;
  students: IStudent[] | null;
  currentStudent: IStudent | null;
  code: string | null;
}

const initialState: IGetStudentsState = {
  status: ApiStatus.idle,
  students: null,
  currentStudent: null,
  code: null
}

interface IGetStudentsRequest {
  token: string;
}

interface IGetStudentsResponse {
  code: string;
  students: IStudent[]; 
}

interface IGetStudentsError {
  code: string; 
}

interface IGetCurrentStudentPayload {
  email: string;
}

export const getStudentsAsync = createAsyncThunk(
  'user/admin/students',
  async (request: IGetStudentsRequest, {rejectWithValue}) => await axios
  .get(
    API_URL_USER + "/admin/students",
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

export const getStudentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
  revertGetStudents: () => {
    return initialState;
  },
  getCurrentStudent: (state: IGetStudentsState, action: PayloadAction<IGetCurrentStudentPayload>) => {
    const res = action.payload;
    if (state.students) {
    state.currentStudent = state.students?.filter((student) => student.email === res.email)[0];
    }
    return state;
  },
  revertCurrentStudent: (state: IGetStudentsState) => {
    state.currentStudent = null;
    return state;
  }

  },
  extraReducers: (builder) => {
  builder
  .addCase(getStudentsAsync.pending, (state, action) => {
    state.status = ApiStatus.loading;
  })
  .addCase(getStudentsAsync.fulfilled, (state, action) => {
    const res = action.payload as IGetStudentsResponse;
    state.students = res.students;
    state.code = res.code;
    state.status = ApiStatus.success;
  })
  .addCase(getStudentsAsync.rejected, (state, action) => {
    const res = action.payload as IGetStudentsError;
    state.code = res.code;
    state.status = ApiStatus.failed;
  })
  }
});

export const { revertGetStudents, getCurrentStudent, revertCurrentStudent } = getStudentsSlice.actions;

export const getStudentsStatus = (root: RootState) => root.getStudents.status;
export const getStudentsCode = (root: RootState) => root.getStudents.code;
export const getStudentsStudents = (root: RootState) => root.getStudents.students;
export const getStudentsCurrentStudent = (root: RootState) => root.getStudents.currentStudent;

export default getStudentsSlice.reducer;