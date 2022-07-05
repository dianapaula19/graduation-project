import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import languagesReducer from "../features/LanguageSwitchSlice";
import loginReducer from "../features/auth/loginSlice";
import registerReducer from "../features/auth/registerSlice";
import recoverAccountReducer from "../features/auth/recoverAccountSlice";
import resetPasswordReducer from "../features/auth/resetPasswordSlice";
import studentDataReducer from "../features/user/student/studentDataSlice";
import studentOptionalsListsReducer from '../features/user/student/studentOptionalsListsSlice';
import saveStudentChoicesReducer from "../features/user/student/saveStudentChoicesSlice";
import getStudentCoursesReducer from "../features/user/student/getStudentCoursesSlice";
import createOptionsListReducer from "../features/user/admin/optionsList/createOptionsListSlice";
import createCourseReducer from "../features/user/admin/course/createCourseSlice";
import updateCourseReducer from "../features/user/admin/course/updateCourseSlice";
import registerBatchStudentsReducer from "../features/user/admin/user/registerBatchStudentsSlice";
import registerBatchTeachersReducer from "../features/user/admin/user/registerBatchTeachersSlice";
import getNotVerifiedUsersReducer from "../features/user/admin/user/getNotVerifiedUsersSlice";
import verifyUserReducer from "../features/user/admin/user/verifyUserSlice";
import updateStudentInfoReducer from "../features/user/admin/user/updateStudentInfoSlice";
import updateTeacherInfoReducer from "../features/user/admin/user/updateTeacherInfoSlice";
import getStudentsReducer from "../features/user/admin/user/getStudentsSlice";
import getTeachersReducer from "../features/user/admin/user/getTeachersSlice";
import getCoursesReducer from "../features/user/admin/course/getCoursesSlice";
import getOptionsListsReducer from "../features/user/admin/optionsList/getOptionsListsSlice";
import updateOptionsListReducer from "../features/user/admin/optionsList/updateOptionsListSlice";
import getStudentsListsReducer from "../features/user/admin/user/getStudentsListsSlice";
import updateSelectionSessionOpenReducer from "../features/user/admin/updateSelectionSessionOpenSlice";
import getTeacherCoursesReducer from "../features/user/teacher/getTeacherCoursesSlice";
import sendAnnouncementReducer from '../features/user/teacher/sendAnnouncementSlice';
import { 
  FLUSH, 
  PAUSE, 
  PERSIST,  
  PURGE, 
  REGISTER, 
  REHYDRATE,
  persistReducer, 
} from 'redux-persist';


const reducers = combineReducers({
  languages: languagesReducer,
  // auth
  login: loginReducer,
  register: registerReducer,
  recoverAccount: recoverAccountReducer,
  resetPassword: resetPasswordReducer,
  // student
  studentData: studentDataReducer,
  studentOptionalsLists: studentOptionalsListsReducer,
  saveStudentChoices: saveStudentChoicesReducer,
  getStudentCourses: getStudentCoursesReducer,
  // admin
  createOptionsList: createOptionsListReducer,
  updateOptionsList: updateOptionsListReducer, 
  getOptionsLists: getOptionsListsReducer,
  createCourse: createCourseReducer,
  updateCourse: updateCourseReducer,
  registerBatchStudents: registerBatchStudentsReducer,
  registerBatchTeachers: registerBatchTeachersReducer, 
  getStudents: getStudentsReducer,
  updateStudentInfo: updateStudentInfoReducer,
  getTeachers: getTeachersReducer,
  updateTeacherInfo: updateTeacherInfoReducer,
  getNotVerifiedUsers: getNotVerifiedUsersReducer,
  verifyUser: verifyUserReducer,
  getCourses: getCoursesReducer,
  updateSelectionSessionOpen: updateSelectionSessionOpenReducer,
  getStudentsLists: getStudentsListsReducer,

  // teacher
  getTeacherCourses: getTeacherCoursesReducer,
  sendAnnouncement: sendAnnouncementReducer
});

const persistConfig = {
  key: 'root',
  version: 1, 
  storage,
}

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
  serializableCheck: {
    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  },
  }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
