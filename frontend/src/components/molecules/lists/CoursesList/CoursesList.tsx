import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { ICoursesListProps } from "./CoursesList.types";
import "./CoursesList.scss";
import Modal from "../../Modal";
import CourseForm from "../../forms/CourseForm";
import Button from "../../../atoms/Button";
import { getCoursesAsync, getCurrentCourse, revertCurrentCourse } from "../../../../features/user/admin/course/getCoursesSlice";
import { revertUpdateCourse, updateCourseShowModal, updateCourseStatus } from "../../../../features/user/admin/course/updateCourseSlice";
import { createCourseShowModal, createCourseStatus, revertCreateCourse } from "../../../../features/user/admin/course/createCourseSlice";
import { loginToken } from "../../../../features/auth/loginSlice";
import { ApiStatus } from "../../../../features/Utils";
import Loader from "../../../atoms/Loader";

const CoursesList = ({
  courses
}: ICoursesListProps) => {

  const componentClassName = "courses-list";
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [formType, setFormType] = useState<'create' | 'update'>('create');

  const buttonsTranslate = "lists.courses.buttons";

  const showModalCreateCourse = useAppSelector(createCourseShowModal);
  const showModalUpdateCourse = useAppSelector(updateCourseShowModal);
  const statusCreateCourse = useAppSelector(createCourseStatus);
  const statusUpdateCourse = useAppSelector(updateCourseStatus);
  const token = useAppSelector(loginToken);
  
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (showModalCreateCourse || showModalUpdateCourse) {
      setShowFormModal(false);
    }
  }, [
    showModalCreateCourse,
    showModalUpdateCourse,
    setShowFormModal
  ]);

  let createCourseModalComponent = null;

  switch (statusCreateCourse) {
    case ApiStatus.loading:
      createCourseModalComponent = <Loader />
      break;
    case ApiStatus.success:
      createCourseModalComponent = (
        <div>
          The course was created successfully
        </div>
      )
      break;
    case ApiStatus.failed:
      createCourseModalComponent = (
        <div>
          There was an error creating the course
        </div>
      )
      break;
    default:
      break;
  }

  let updateCourseModalComponent = null;

  switch (statusUpdateCourse) {
    case ApiStatus.loading:
      updateCourseModalComponent = <Loader />
      break;
    case ApiStatus.success:
      updateCourseModalComponent = (
        <div>
          The course was updated successfully
        </div>
      )
      break;
    case ApiStatus.failed:
      updateCourseModalComponent = (
        <div>
          There was an error updating the course
        </div>
      )
      break;
    default:
      break;
  }
  

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
      <br/>
      <br/>
      <Button 
        label={t(`${buttonsTranslate}.create`)} 
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

    <Modal 
      show={showModalCreateCourse} 
      closeModal={() => {
        if (token) {
          dispatch(getCoursesAsync({
            token: token
          }));
          dispatch(revertCreateCourse());
        }
      }}
    >
      {createCourseModalComponent}
    </Modal>

    <Modal 
      show={showModalUpdateCourse} 
      closeModal={() => {
        if (token) {
          dispatch(getCoursesAsync({
            token: token
          }));
          dispatch(revertUpdateCourse());
        }
      }}
    >
      {updateCourseModalComponent}
    </Modal>  
  
    </>
  );

};

export default CoursesList;