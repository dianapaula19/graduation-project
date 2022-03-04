import React, { useRef, useState } from "react";
import Button from "../../atoms/Button";
import { ButtonModifier } from "../../atoms/Button/Button.types";
import OptionalCourseCard from "../OptionalCourseCard/OptionalCourseCard";
import { IOptionalCourseCardProps } from "../OptionalCourseCard/OptionalCourseCard.types";
import "./OptionalCoursesContainer.scss";
import { IOptionalCoursesContainerProps } from "./OptionalCoursesContainer.types";



const OptionalCoursesContainer = ({
    title,
    optionalCourses
}: IOptionalCoursesContainerProps) => {

    const componentClassName = "optional-courses-container";
    
    const [list, setList] = useState<IOptionalCourseCardProps[]>(optionalCourses);

    const draggingCard = useRef<number | null>(null); 
    const dragOverCard = useRef<number | null>(null);
    
    const saveChanges = () => {

    }

    const handleDragStart = (
        event: React.DragEvent<HTMLDivElement>,
        cardIndex: number
    ) => {
        console.log("start");
        draggingCard.current = cardIndex;
    }

    const handleDragEnter = (
        event: React.DragEvent<HTMLDivElement>, 
        cardIndex: number) => 
    {
        console.log("enter");
        dragOverCard.current = cardIndex;
    }

    const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {

        console.log("end");

        const draggingCardIndex = draggingCard.current as number;
        const dragOverCardIndex = dragOverCard.current as number;

        const listCopy = [...list];
        
        const draggingItemContent = listCopy[draggingCardIndex];
        listCopy.splice(draggingCardIndex, 1);
        listCopy.splice(dragOverCardIndex, 0, draggingItemContent);

        draggingCard.current = null;
        dragOverCard.current = null;
        
        setList(listCopy);

    };
    
    return (
        <div 
            className={componentClassName}
        >
            <span 
                className={`${componentClassName}__title`}
            >
                {title}
            </span>
            <div
                className={`${componentClassName}__list`}
            >
                {optionalCourses.map((optionalCourse, idx) => {
                    return (
                        <div
                            draggable
                            key={idx}
                            onDragStart={(e) => handleDragStart(e, idx)}
                            onDragEnter={(e) => handleDragEnter(e, idx)}
                            onDragEnd={(e) => handleDragEnd(e)}
                        >
                            <OptionalCourseCard
                                {...optionalCourse} 
                            />
                        </div>
                    )
                })}
            </div>
            <Button 
                label={"Save Changes"} 
                disabled={false} 
                modifier={ButtonModifier.save}
                onClick={saveChanges} 
            />

        </div>
    )
}

export default OptionalCoursesContainer;