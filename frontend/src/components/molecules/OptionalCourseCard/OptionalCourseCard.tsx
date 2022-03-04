import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faFile } from "@fortawesome/free-solid-svg-icons";
import { IOptionalCourseCardProps } from "./OptionalCourseCard.types";
import "./OptionalCourseCard.scss";

const OptionalCourseCard = ({
    optionalName,
    teacherName,
    teacherEmail,
    linkDocument
}: IOptionalCourseCardProps) => {

    const componentClassName = "optional-course-card";

    return (
        <div 
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
            <a 
                href={linkDocument}
                target="_blank" 
                rel="noopener noreferrer"
                className={`${componentClassName}__a`}
            >
                <FontAwesomeIcon 
                    icon={faFile}
                    className={`${componentClassName}__file-icon`}
                />    
            </a>            
        </div>
    )
}

export default OptionalCourseCard;