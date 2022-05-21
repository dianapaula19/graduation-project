import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import languagesReducer from "../components/atoms/LanguagesSwitch/LanguageSwitchSlice";
import authReducer from "../features/auth/authSlice";


export const store = configureStore({
  reducer: {
    counter: counterReducer,
    languages: languagesReducer,
    auth: authReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
