import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { loginUserData } from "../../../features/auth/loginSlice";
import { Choice, saveStudentChoicesAsync } from "../../../features/user/student/saveStudentChoicesSlice";
import Button from "../../atoms/Button";
import { ButtonModifier } from "../../atoms/Button/Button.types";
import OptionalCourseCard from "../OptionalCourseCard/OptionalCourseCard";
import "./OptionalCoursesContainer.scss";
import { IDataRef, IOptionalCourseCard, IOptionalCoursesContainerProps } from "./OptionalCoursesContainer.types";

const OptionalCoursesContainer = ({
  optionalsListId,
  title, 
  courses
}: IOptionalCoursesContainerProps) => {

  const componentClassName = "optional-courses-container";

  const { t } = useTranslation();
  
  const dispatch = useAppDispatch();
  const userData = useAppSelector(loginUserData);

  const [list, setList] = useState<IOptionalCourseCard[]>(courses);

  const draggingItem = useRef<HTMLDivElement | IDataRef | null>(null);
  const dragOverItem = useRef<HTMLDivElement | IDataRef | null>(null);
  
  const saveChanges = () => {
    if (userData !== null) {
      let choices: Choice[] = []
      list.forEach((item, index) => {
        choices.push({
          course_id: item.courseId,
          order: index
        })
      });
      dispatch(saveStudentChoicesAsync({
        options_list_id: optionalsListId,
        email: userData.email,
        choices: choices 
      }))
    }
  }

  const handleDragStart = (
    position: number,
    id: number,
  ) => {
    draggingItem.current = {position, id};
  };
  
  const handleDragEnter = (
    position: number,
    id: number,
  ) => {
    dragOverItem.current = {position, id};

    const listCopy = [...list];
    const draggingDataRef = draggingItem.current as IDataRef;
    const dragOverDataRef = dragOverItem.current as IDataRef;
    const draggingItemPosition = draggingDataRef.position;
    const draggingItemId = draggingDataRef.id;
    const dragOverItemPosition = dragOverDataRef.position;
    const dragOverItemId = dragOverDataRef.id;

    if (draggingItemId !== dragOverItemId) {
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
        {title}
      </span>
      <div
        className={`${componentClassName}__list`}
      >   
        {list.map((optionalCourse, index) => {
          const args = {
            index: index,
            optionalCourseId: optionalCourse.courseId,
            optionalsListId: optionalsListId,
            optionalName: optionalCourse.courseTitle,
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