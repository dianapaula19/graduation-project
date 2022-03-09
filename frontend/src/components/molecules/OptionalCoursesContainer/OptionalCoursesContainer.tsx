import React, { useCallback, useRef, useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult, ResponderProvided } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import Button from "../../atoms/Button";
import { ButtonModifier } from "../../atoms/Button/Button.types";
import OptionalCourseCard from "../OptionalCourseCard/OptionalCourseCard";
import { IOptionalCourseCardProps } from "../OptionalCourseCard/OptionalCourseCard.types";
import "./OptionalCoursesContainer.scss";
import { IOptionalCoursesContainerProps } from "./OptionalCoursesContainer.types";

const OptionalCoursesContainer = ({
    groupId,
    groupTitle,
    optionalCourses
}: IOptionalCoursesContainerProps) => {

    const componentClassName = "optional-courses-container";

    const { t } = useTranslation();
    
    const [list, setList] = useState<IOptionalCourseCardProps[]>(optionalCourses);
    
    const saveChanges = () => {

    }

    const onDragEnd = (result: DropResult): void => {

        if (!result.destination) return;
        
        const { source, destination } = result;

        if (!destination) {
            return;
        }
      
        if (source.index === destination.index) {
            return;
        } 

        let items = [...list];
        const [ removed ] = items.splice(source.index, 1);
        items.splice(destination.index, 0, removed);

        setList([...items]);

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
            <DragDropContext
                onDragEnd={onDragEnd}
            >   
                <Droppable droppableId={groupId}>
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`${componentClassName}__list`}
                        >   
                            {list.map((optionalCourse, index) => {
                                return (
                                    <OptionalCourseCard 
                                        key={index}
                                        {...optionalCourse}
                                    />
                                );
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
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