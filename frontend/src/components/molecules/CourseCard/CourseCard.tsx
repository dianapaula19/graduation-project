import React from "react"
import { useTranslation } from "react-i18next";
import LinkButton, { LinkButtonModifier } from "components/atoms/LinkButton";
import { ICourseCardProps } from "./CourseCard.types";
import "./CourseCard.scss";

const CourseCard = ({
  courseTitle,
  teacherName,
  teacherEmail,
  linkDocument
}: ICourseCardProps) => {

  const componentClassName = "student-course-card";

  const { t } = useTranslation();
  
  return (
    <div 
      className={componentClassName}
    >
      <span
        className={`${componentClassName}__info`}
      >
        {courseTitle} | {teacherName} ({teacherEmail})
      </span>
      {linkDocument && (
        <LinkButton 
          text={t("common:buttons.syllabus")}
          modifier={LinkButtonModifier.syllabus} 
          href={linkDocument}     
          target="_blank"     
        />    
      )} 
    </div>
  )
}

export default CourseCard;