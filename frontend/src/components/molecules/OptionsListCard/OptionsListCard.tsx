import React from "react";
import { useTranslation } from "react-i18next";
import { IOptionalCourseCardProps } from "../OptionalCourseCard/OptionalCourseCard.types";
import { IOptionsListCardProps } from "./OptionsListCard.types";
import "./OptionsListCard.scss";

const OptionsListCard = ({
  data,
  onClick   
}
: 
IOptionsListCardProps) => {
  
  const componentClassName = "optionals-list-card";
  const { t } = useTranslation();
  
  return (
    <div
      className={componentClassName}
      onClick={onClick}
    >
      <span
        className={`${componentClassName}__main-title`}
      >
        {t(`degrees.${data.degree}`)}, {t(`learningModes.${data.learning_mode}`)}, {t(`studyPrograms.${data.study_program}`)} 
      </span>
      <span
        className={`${componentClassName}__sub-title`}
      >
        {t('molecules.optionsListCard.year')} {data.year}, {t('molecules.optionsListCard.semester')} {data.semester}
      </span>
      <span
        className={`${componentClassName}__title`}
      >
        {data.title}
      </span>

    </div>
  )
}

export default OptionsListCard;