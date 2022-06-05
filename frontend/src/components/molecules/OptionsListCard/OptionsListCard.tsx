import React from "react";
import { useTranslation } from "react-i18next";
import { IOptionalCourseCardProps } from "../OptionalCourseCard/OptionalCourseCard.types";
import { IOptionalsListCardProps } from "./OptionsListCard.types";
import "./OptionsListCard.scss";

const OptionsListCard = ({
  title,
  year, 
  semester,
  domain,
  degree,
  learningMode, 
  studyProgram   
}
: 
IOptionalsListCardProps) => {
  
  const componentClassName = "optionals-list-card";
  const { t } = useTranslation();
  
  return (
    <div
      className={componentClassName}
    >
      <span
        className={`${componentClassName}__main-title`}
      >
        {t(`domains.${domain}`)}, {t(`degrees.${degree}`)}, {t(`learningModes.${learningMode}`)}, {t(`studyPrograms.${studyProgram}`)} 
      </span>
      <span
        className={`${componentClassName}__sub-title`}
      >
        {t('molecules.optionsListCard.year')} {year}, {t('molecules.optionsListCard.semester')} {semester}
      </span>
      <span
        className={`${componentClassName}__title`}
      >
        {title}
      </span>

    </div>
  )
}

export default OptionsListCard;