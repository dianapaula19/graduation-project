import { t } from "i18next";
import React from "react";
import { useTranslation } from "react-i18next";
import NotFoundSvg from "./assets/not-found.svg";
import "./NotFoundPage.scss";

const NotFoundPage = () => {
  
  const componentClassName = "not-found-page";
  const { t } = useTranslation("pages");
  
  return (
    <div 
      className={componentClassName}
    >
      <img
        src={NotFoundSvg}
        className={`${componentClassName}__img`}
        tabIndex={1}
      />
      <p
        className={`${componentClassName}__text`}
      >
        {t("notFound.message")} <a className={`${componentClassName}__text__a`} href="/">{t("notFound.link")}</a>
      </p>
    </div>
  )
}

export default NotFoundPage;