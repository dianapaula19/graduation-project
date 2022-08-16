import NotFoundSVG from "assets/not-found.svg";
import { useTranslation } from "react-i18next";
import "./NotFoundPage.scss";

const NotFoundPage = () => {
  
  const componentClassName = "not-found-page";
  const { t } = useTranslation("pages");
  
  return (
    <div 
      className={componentClassName}
    >
      <img
        src={NotFoundSVG}
        className={`${componentClassName}__img`}
        alt={t("common:img.notFound")}
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