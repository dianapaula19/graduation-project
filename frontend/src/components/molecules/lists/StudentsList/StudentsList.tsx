import React from "react";
import { IStudentsListProps } from "./StudentsList.types";
import { useTranslation } from "react-i18next";
import "./StudentsList.scss";

const StudentsList = ({
  students
}: IStudentsListProps) => {

  const componentClassName = "students-list";
  
  const { t } = useTranslation('lists');

  return (
    <div 
      className={componentClassName}
    >
      <div 
        className={`${componentClassName}__header`}
      >
        <span
          className={`${componentClassName}__index`}
        >
          #
        </span>
        <span
          className={`${componentClassName}__name`}
        >
          {t("students.header.name")}
        </span>
        <span
          className={`${componentClassName}__email`}
        >
          {t("students.header.email")}
        </span>
        
      </div>
      {students.map((student, idx) => {
        return (
          <div 
            className={`${componentClassName}__item`}
          >
            <span
              className={`${componentClassName}__index`}
            >
              {idx + 1}
            </span>
            <span
              className={`${componentClassName}__name`}
            >
              {`${student.first_name} ${student.last_name}`}
            </span>
            <a
              className={`${componentClassName}__email`}
              href={`mailto:${student.email}`}
            >
              {student.email}
            </a>
          </div>
        )
      })}
    </div>
  );
}

export default StudentsList;