import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { IOptionalCourseCardProps } from "./OptionalCourseCard.types";
import { useTranslation } from "react-i18next";
import LinkButton from "../../atoms/LinkButton";
import { LinkButtonModifier } from "../../atoms/LinkButton";
import "./OptionalCourseCard.scss";

const OptionalCourseCard = ({
    index,
    optionalCourseId,
    optionalsListId,
    handleDragStart,
    handleDragEnter,
    optionalName,
    teacherName,
    teacherEmail,
    linkDocument, 
}: IOptionalCourseCardProps) => {

    const componentClassName = "optional-course-card";

    const { t } = useTranslation();

    return (
        <div 
            className={componentClassName}
            onDragStart={() => handleDragStart(index, optionalsListId)}
            onDragEnter={() => handleDragEnter(index, optionalsListId)}
            onDragEnd={(e) => e.preventDefault()}
            key={optionalCourseId}
            draggable
        >
            <FontAwesomeIcon 
                icon={faBars}
                className={`${componentClassName}__drag-icon`} 
            />
            <span
                className={`${componentClassName}__info`}
            >
                {optionalName} | {teacherName} ({teacherEmail})
            </span>
            {linkDocument && (
                <LinkButton 
                    text={t("syllabusButton")}
                    modifier={LinkButtonModifier.syllabus} 
                    href={linkDocument}       
                    target="_blank"         
                />      
            )} 
        </div>
    )
}

export default OptionalCourseCard;