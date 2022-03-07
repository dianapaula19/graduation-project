import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { IOptionalCourseCardProps } from "./OptionalCourseCard.types";
import "./OptionalCourseCard.scss";
import { Draggable } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import LinkButton from "../../atoms/LinkButton";
import { LinkButtonModifier } from "../../atoms/LinkButton";

const OptionalCourseCard = ({
    optionalName,
    teacherName,
    teacherEmail,
    linkDocument, 
    draggableProps
}: IOptionalCourseCardProps) => {

    const componentClassName = "optional-course-card";

    const { t } = useTranslation();

    return (
        <Draggable
            {...draggableProps}
        >
        {(provided, snapshot) => (
            <div 
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={componentClassName}
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
        )}   
        </Draggable>
    )
}

export default OptionalCourseCard;