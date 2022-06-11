import { createSlice } from "@reduxjs/toolkit";
import { RootState, store } from "../../../app/store";
import { Language, LanguageState } from "./LanguagesSwitch.types";


const initialState: LanguageState = {
  language: localStorage.getItem('language') == 'en' ? Language.en : Language.ro
};

export const languagesSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    switchToEnglish: (state: { language: Language; }) => {
      state.language = Language.en;
      localStorage.setItem('language', 'en');
    },
    switchToRomanian: (state: { language: Language; }) => {
      state.language = Language.ro;
      localStorage.setItem('language', 'ro');
    }
  }
});

export const { switchToEnglish, switchToRomanian } = languagesSlice.actions;

export const currentLanguage = (state: RootState) => state.languages.language;

export default languagesSlice.reducer;