
import { useTranslation } from "react-i18next";
import "./OptionsListCard.scss";
import { IOptionsListCardProps } from "./OptionsListCard.types";

const OptionsListCard = ({
  data,
  onClick   
}: IOptionsListCardProps
) => {
  
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
    {t('common:text.year')} {data.year}, {data.semester === 1 ? t('common:text.firstSemester') : t('common:text.secondSemester')}
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