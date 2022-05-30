import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../../app/store";
import { Domain, LearningMode, StudyProgram, Degree } from "../../../components/App"
import { loginToken } from "../../auth/loginSlice";
import { ApiStatus, API_URL_USER } from "../../Utils";

export interface Grade {
  grade: number;
  year: number;
}

export interface Course {
  id: number;
  title: string;
  link: string;
}

export interface StudentData {
  domain: Domain;
  learning_mode: LearningMode;
  degree: Degree;
  study_program: StudyProgram;
  current_group: string;
  current_year: number;
  current_semester: number;
  grades: Grade[]
}

export interface StudentDataState {
  code: null | string;
  studentData: null | StudentData;
  status: ApiStatus;
}

const initialState: StudentDataState = {
  code: null,
  studentData: null,
  status: ApiStatus.idle
}

export interface IStudentDataRequest {
  email: string;
  token: string;
}

export interface IStudentDataResponse {
  code: string;
  student_data: StudentData;
}

export interface IStudentDataError {
  code: string;
}

export const studentDataAsync = createAsyncThunk(
  'user/student/data',
  async (request: IStudentDataRequest, {rejectWithValue}) => await axios
    .post(
        API_URL_USER + "/student/data",
        {
          email: request.email
        }, 
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
      return rejectWithValue(error.response.data)
    })
)

export const studentDataSlice = createSlice({
  name: 'studentData',
  initialState,
  reducers: {
    revertStudentData: () => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(studentDataAsync.pending, (state) => {
      state.status = ApiStatus.loading;
    })
    .addCase(studentDataAsync.fulfilled, (state, action) => {
      const res = action.payload as IStudentDataResponse;
      state.code = res.code;
      state.studentData = res.student_data;
      state.status = ApiStatus.success;
    })
    .addCase(studentDataAsync.rejected, (state, action) => {
      const res = action.payload as IStudentDataError;
      state.code = res.code;
      state.status = ApiStatus.failed;
    })
  }
});

export const { revertStudentData } = studentDataSlice.actions;

export const studentDataStatus = (state: RootState) => state.studentData.status;
export const studentDataData = (state: RootState) => state.studentData.studentData;


export default studentDataSlice.reducer;