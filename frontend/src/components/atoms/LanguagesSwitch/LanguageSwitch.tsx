import React from "react"
import { useAppDispatch } from "../../../app/hooks";
import {
    switchToEnglish,
    switchToRomanian
} from "./LanguageSwitchSlice";
import "./LanguageSwitch.scss"

const LanguageSwitch = () => {

    const componentClassName = "language-switch";

    return(
        <div className={componentClassName}>
            <img
                className={`${componentClassName}__img`}
                alt="Romania"
                src="http://purecatamphetamine.github.io/country-flag-icons/3x2/RO.svg"
                onClick={() => {}}
            />
            <img
                className={`${componentClassName}__img`}
                alt="United Kingdom"
                src="http://purecatamphetamine.github.io/country-flag-icons/3x2/GB.svg"
                onClick={() => {}}
            />
        </div>
    )
}

export default LanguageSwitch;