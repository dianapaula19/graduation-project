import { useAppDispatch, useAppSelector } from "app/hooks";
import Button from "components/atoms/Button";
import Modal from "components/molecules/Modal";
import ModalApiStatus from "components/molecules/ModalApiStatus";
import CourseForm from "components/organisms/forms/CourseForm";
import { loginToken } from "features/account/loginSlice";
import { createCourseShowModal, createCourseStatus, revertCreateCourse } from "features/user/admin/course/createCourseSlice";
import { deleteCourseShowModal, deleteCourseStatus, revertDeleteCourse } from "features/user/admin/course/deleteCourseSlice";
import { getCurrentCourse, revertCurrentCourse, getCoursesAsync } from "features/user/admin/course/getCoursesSlice";
import { updateCourseShowModal, updateCourseStatus, revertUpdateCourse } from "features/user/admin/course/updateCourseSlice";
import { ApiStatus } from "features/Utils";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./CoursesList.scss";
import { ICoursesListProps } from "./CoursesList.types";

const CoursesList = ({
  courses
}: ICoursesListProps
) => {

  const { t } = useTranslation('lists');

  const dispatch = useAppDispatch();

  const componentClassName = "courses-list";
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [formType, setFormType] = useState<'create' | 'update'>('create');

  const buttonsTranslate = "courses.buttons";

  const showModalCreateCourse = useAppSelector(createCourseShowModal);
  const showModalUpdateCourse = useAppSelector(updateCourseShowModal);
  const showModalDeleteCourse = useAppSelector(deleteCourseShowModal);
  const statusCreateCourse = useAppSelector(createCourseStatus);
  const statusUpdateCourse = useAppSelector(updateCourseStatus);
  const statusDeleteCourse = useAppSelector(deleteCourseStatus);
  const token = useAppSelector(loginToken);

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
    case ApiStatus.success:
      createCourseModalComponent = <ModalApiStatus 
        message={t("courses.success.create")} 
        status={statusCreateCourse}
      />;
      break;
    case ApiStatus.failed:
      createCourseModalComponent = <ModalApiStatus 
        message={t("courses.error.create")} 
        status={statusCreateCourse}
      />;
      break;
    default:
      break;
  }

  let updateCourseModalComponent = null;

  switch (statusUpdateCourse) {
    case ApiStatus.success:
      updateCourseModalComponent = <ModalApiStatus 
        message={t("courses.success.update")} 
        status={statusUpdateCourse}
      />;
      break;
    case ApiStatus.failed:
      updateCourseModalComponent = <ModalApiStatus 
        message={t("courses.error.update")} 
        status={statusUpdateCourse}
      />;
      break;
    default:
      break;
  }

  let deleteCourseModalComponent = null;

  switch (statusDeleteCourse) {
    case ApiStatus.success:
      deleteCourseModalComponent = <ModalApiStatus 
        message={t("courses.success.delete")} 
        status={statusUpdateCourse}
      />;
      break;
    case ApiStatus.failed:
      deleteCourseModalComponent = <ModalApiStatus 
        message={t("courses.error.delete")} 
        status={statusUpdateCourse}
      />;
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
          {t("courses.header.title")}
        </span>
        <span
          className={`${componentClassName}__teacher`}
        >
          {t("courses.header.teacher")}
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
              setFormType("update");
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
        setFormType("create");
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
    <Modal 
      show={showModalDeleteCourse} 
      closeModal={() => {
        if (token) {
          dispatch(getCoursesAsync({
            token: token
          }));
          dispatch(revertDeleteCourse());
        }
      }}
    >
      {deleteCourseModalComponent}
    </Modal>   
    </>
  );

};

export default CoursesList;