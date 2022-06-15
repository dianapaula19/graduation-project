import React from "react";
import classNames from "classnames";
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  currentLanguage,
  Language,
  switchToEnglish,
  switchToRomanian
} from "../../../features/LanguageSwitchSlice";
import "./LanguageSwitch.scss";

const LanguageSwitch = () => {

  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();

  const language = useAppSelector(currentLanguage);
  
  const componentClassName = "language-switch";

  return(
    <div className={componentClassName}>
      <img
        className={classNames(
          `${componentClassName}__img`,
          language === Language.ro && `${componentClassName}__img--selected`
        )}
        alt={t("ro")}
        src="http://purecatamphetamine.github.io/country-flag-icons/3x2/RO.svg"
        onClick={() => {
          i18n.changeLanguage(Language.ro);
          dispatch(switchToRomanian());
        }}
      />
      <img
        className={classNames(
          `${componentClassName}__img`,
          language === Language.en && `${componentClassName}__img--selected`
        )}
        alt={t("en")}
        src="http://purecatamphetamine.github.io/country-flag-icons/3x2/GB.svg"
        onClick={() => {
          i18n.changeLanguage(Language.en);
          dispatch(switchToEnglish())
        }}
      />
    </div>
  )
}

export default LanguageSwitch;