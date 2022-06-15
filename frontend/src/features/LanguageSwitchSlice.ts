import { createSlice } from "@reduxjs/toolkit";
import { RootState, store } from "../app/store";

export enum Language {
  ro = "ro",
  en = "en"
}

interface ILanguageState {
  language: Language
}

const initialState: ILanguageState = {
  language: localStorage.getItem('language') == 'en' ? Language.en : Language.ro
};

export const languagesSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    switchToEnglish: (state: { language: Language; }) => {
      state.language = Language.en;
      localStorage.setItem('language', 'en');
      return state;
    },
    switchToRomanian: (state: { language: Language; }) => {
      state.language = Language.ro;
      localStorage.setItem('language', 'ro');
      return state;
    }
  }
});

export const { switchToEnglish, switchToRomanian } = languagesSlice.actions;

export const currentLanguage = (state: RootState) => state.languages.language;

export default languagesSlice.reducer;