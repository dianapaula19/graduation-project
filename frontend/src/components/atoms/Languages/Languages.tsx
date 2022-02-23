import React from "react"
import { useAppDispatch } from "../../../app/hooks";
import {
    switchToEnglish,
    switchToRomanian
} from "./LanguagesSlice";
import "./Languages.scss"

const Languages = () => {
    return(
        <div className="languages">
            <img
                className="languages__img"
                alt="Romania"
                src="http://purecatamphetamine.github.io/country-flag-icons/3x2/RO.svg"
                onClick={() => {}}
            />
            <img
                className="languages__img"
                alt="United Kingdom"
                src="http://purecatamphetamine.github.io/country-flag-icons/3x2/GB.svg"
                onClick={() => {}}
            />
        </div>
    )
}

export default Languages;