import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import counterReducer from '../features/counter/counterSlice';
import languagesReducer from "../components/atoms/LanguagesSwitch/LanguageSwitchSlice";
import loginReducer from "../features/auth/loginSlice";
import registerReducer from "../features/auth/registerSlice";
import studentDataReducer from "../features/user/student/studentDataSlice";
import teacherCoursesReducer from "../features/course/teacherCourseSlice";
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
  counter: counterReducer,
  languages: languagesReducer,
  login: loginReducer,
  register: registerReducer,
  studentData: studentDataReducer,
  teacherCourse: teacherCoursesReducer
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
