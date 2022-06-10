import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../app/hooks";
import { ICoursesListProps } from "./CoursesList.types";
import "./CoursesList.scss";
import Modal from "../../Modal";
import CourseForm from "../../forms/CourseForm";
import Button from "../../../atoms/Button";
import { getCurrentCourse, revertCurrentCourse } from "../../../../features/user/admin/getCoursesSlice";

const CoursesList = ({
  courses
}: ICoursesListProps) => {

  const componentClassName = "courses-list";
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [formType, setFormType] = useState<'create' | 'update'>('create');
    
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  return (
      <>
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
                    className={`${componentClassName}__title`}
                >
                    {t("lists.courses.header.title")}
                </span>
                <span
                    className={`${componentClassName}__teacher`}
                >
                    {t("lists.courses.header.teacher")}
                </span>
            </div>
            {courses.map((course, idx) => {
                return (
                    <div 
                        className={`${componentClassName}__item`}
                        onClick={() => {
                            dispatch(getCurrentCourse({
                                id: course.id
                            }));
                            setFormType('update');
                            setShowFormModal(true);
                        }}
                    >
                        <span
                            className={`${componentClassName}__index`}
                        >
                            {idx + 1}
                        </span>
                        <span
                            className={`${componentClassName}__title`}
                        >
                            {course.title}
                        </span>
                        <span
                            className={`${componentClassName}__teacher`}
                        >
                            {`${course.teacher_first_name} ${course.teacher_last_name}`}
                        </span>
                    </div>
                )
            })}
            <Button 
              label={""} 
              disabled={false}
              onClick={() => {
                setFormType('create');
                setShowFormModal(true);
              }} 
            />
        </div>
        
        <Modal 
            show={showFormModal} 
            closeModal={() => {
                dispatch(revertCurrentCourse());
                setShowFormModal(false);
            }} 
        >
            <CourseForm type={formType} />
        </Modal>    
    
      </>
  );

};

export default CoursesList;