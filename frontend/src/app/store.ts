import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import languagesReducer from "../components/atoms/LanguagesSwitch/LanguageSwitchSlice";
import loginReducer from "../features/auth/loginSlice";
import registerReducer from "../features/auth/registerSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    languages: languagesReducer,
    login: loginReducer,
    register: registerReducer,
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
