import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import { Language, LanguageState } from "./LanguagesSwitch.types";


const initialState: LanguageState = {
    language: Language.ro 
};

export const languagesSlice = createSlice({
    name: "language",
    initialState,
    reducers: {
        switchToEnglish: (state) => {
            state.language = Language.en;
        },
        switchToRomanian: (state) => {
            state.language = Language.ro;
        }
    }
});

export const { switchToEnglish, switchToRomanian } = languagesSlice.actions;

export const currentLanguage = (state: RootState) => state.languages.language;

export default languagesSlice.reducer;