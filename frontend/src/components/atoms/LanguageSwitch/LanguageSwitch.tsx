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
import roFlag from "flag-icons/flags/4x3/ro.svg";
import gbFlag from "flag-icons/flags/4x3/gb.svg";

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
        src={roFlag}
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
        src={gbFlag}
        onClick={() => {
          i18n.changeLanguage(Language.en);
          dispatch(switchToEnglish())
        }}
      />
    </div>
  )
}

export default LanguageSwitch;