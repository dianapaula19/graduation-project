import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../atoms/Button";
import { ButtonModifier } from "../../atoms/Button/Button.types";
import OptionalCourseCard from "../OptionalCourseCard/OptionalCourseCard";
import "./OptionalCoursesContainer.scss";
import { IDataRef, IOptionalCourseCard, IOptionalCoursesContainerProps } from "./OptionalCoursesContainer.types";

const OptionalCoursesContainer = ({
    groupId,
    groupTitle,
    optionalCourses
}: IOptionalCoursesContainerProps) => {

    const componentClassName = "optional-courses-container";

    const { t } = useTranslation();
    
    const [list, setList] = useState<IOptionalCourseCard[]>(optionalCourses);

    const draggingItem = useRef<HTMLDivElement | IDataRef | null>(null);
    const dragOverItem = useRef<HTMLDivElement | IDataRef | null>(null);
    
    const saveChanges = () => {
        console.log(list);
    }

    const handleDragStart = (
        e: React.DragEvent<HTMLDivElement>, 
        position: number,
        groupId: string,
    ) => {
        draggingItem.current = {position, groupId};
    };
    
    const handleDragEnter = (
        e: React.DragEvent<HTMLDivElement>, 
        position: number,
        groupId: string,
    ) => {
        dragOverItem.current = {position, groupId};
        const listCopy = [...list];
        const draggingDataRef = draggingItem.current as IDataRef;
        const dragOverDataRef = dragOverItem.current as IDataRef;
        const draggingItemPosition = draggingDataRef.position;
        const draggingItemGroupId = draggingDataRef.groupId;
        const dragOverItemPosition = dragOverDataRef.position;
        const dragOverItemGroupId = dragOverDataRef.groupId;

        if (draggingItemGroupId !== dragOverItemGroupId) {
            return;
        }

        const draggingItemContent = listCopy[draggingItemPosition];
        
        listCopy.splice(draggingItemPosition, 1);
        listCopy.splice(dragOverItemPosition, 0, draggingItemContent);

        draggingItem.current = dragOverItem.current;
        dragOverItem.current = null;
        setList(listCopy);
    };

    return (
        <div 
            className={componentClassName}
        >
            <span 
                className={`${componentClassName}__title`}
            >
                {groupTitle}
            </span>
            <div
                className={`${componentClassName}__list`}
            >   
                {list.map((optionalCourse, index) => {
                    const args = {
                        index: index,
                        groupId: groupId,
                        handleDragStart: handleDragStart,
                        handleDragEnter: handleDragEnter,
                        ...optionalCourse
                    }
                    return (
                        <OptionalCourseCard 
                            {...args}
                        />
                    );
                })}
            </div>
            <Button 
                label={t("saveButton")} 
                disabled={false} 
                modifier={ButtonModifier.save}
                onClick={saveChanges} 
            />

        </div>
    )
}

export default OptionalCoursesContainer;