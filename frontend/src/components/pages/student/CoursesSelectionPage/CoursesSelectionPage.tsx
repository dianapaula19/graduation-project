import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { loginToken, loginUserData } from "../../../../features/auth/loginSlice";
import { revertSaveStudentChoices, saveStudentChoicesShowModal, saveStudentChoicesStatus } from "../../../../features/user/student/saveStudentChoicesSlice";
import { studentOptionalsListsAsync, studentOptionalsListsStatus, studentOptionalsLists, revertStudentOptionalsLists } from "../../../../features/user/student/studentOptionalsListsSlice";
import { ApiStatus } from "../../../../features/Utils";
import FetchStatus from "../../../molecules/FetchStatus";
import Modal from "../../../molecules/Modal";
import ModalApiStatus from "../../../molecules/ModalApiStatus";
import OptionalCoursesContainer from "../../../molecules/OptionalCoursesContainer";
import { IOptionalCourseCard } from "../../../molecules/OptionalCoursesContainer/OptionalCoursesContainer.types";
import LoggedUserPage from "../../../templates/LoggedUserPage";

const CoursesSelectionPage = () => {

  const { t } = useTranslation("pages");

  const userData = useAppSelector(loginUserData);
  const token = useAppSelector(loginToken);
  const statusStudentOptionsLists = useAppSelector(studentOptionalsListsStatus);
  const studentOptionsLists = useAppSelector(studentOptionalsLists);
  const showModalSaveStudentChoices = useAppSelector(saveStudentChoicesShowModal);
  const statusSaveStudentChoices = useAppSelector(saveStudentChoicesStatus);
  
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (statusStudentOptionsLists === ApiStatus.idle && userData && token) {
      dispatch(studentOptionalsListsAsync({
        email: userData.email,
        token: token
      }))
    }
  }, [])

  let modal = null;
  
  switch (statusSaveStudentChoices) {
    case ApiStatus.success:
      modal = <ModalApiStatus 
        message={t("student.coursesSelection.success.saveStudentChoices")} 
        error={false} 
      />
      break;
    case ApiStatus.failed:
      modal = <ModalApiStatus 
        message={t("student.coursesSelection.error.saveStudentChoices")} 
        error={true} 
      />
      break;
    default:
      break;
  }

  let component = null;

  switch (statusStudentOptionsLists) {
    case ApiStatus.loading:
      component = <FetchStatus status={ApiStatus.loading} />
      break;
    case ApiStatus.failed:
      component = <FetchStatus 
        status={ApiStatus.failed}
        message={t("student.coursesSelection.error.fetchStudentOptionsList")} 
      /> 
      break;
    case ApiStatus.success:
      component = <div>
        <div>
          <span
            style={{
              fontSize: 'x-large'
            }}
          >
            {t("common:text.firstSemester")}
          </span>
          <div>
          { studentOptionsLists !== null && studentOptionsLists.filter((optionsList) => optionsList.semester == 1).map((optionsList) => {
            let courses: IOptionalCourseCard[] = []
            optionsList.courses.forEach(course => {
              courses.push({
                courseId: course.id,
                courseTitle: course.title,
                teacherName: `${course.teacher_first_name} ${course.teacher_last_name}`,
                teacherEmail: course.teacher_email,
                linkDocument: course.link,
              })
            });
            return (
              <OptionalCoursesContainer 
                optionalsListId={optionsList.id} 
                title={optionsList.title} 
                courses={courses} 
              />
            )
          })}
          </div>
        </div>
        <div>
          <span
            style={{
              fontSize: 'x-large'
            }}
          >
            {t("common:text.secondSemester")}
          </span>
          <div>
          { studentOptionsLists !== null && studentOptionsLists.filter((optionsList) => optionsList.semester == 2).map((optionsList) => {
            let courses: IOptionalCourseCard[] = []
            optionsList.courses.forEach(course => {
              courses.push({
                courseId: course.id,
                courseTitle: course.title,
                teacherName: `${course.teacher_first_name} ${course.teacher_last_name}`,
                teacherEmail: course.teacher_email,
                linkDocument: course.link,
              })
            });
            return (
              <OptionalCoursesContainer 
                optionalsListId={optionsList.id} 
                title={optionsList.title} 
                courses={courses} 
              />
            )
          })}
          </div>
        </div>
      </div>
      break;
    default:
      break;
  }

  return (
    <LoggedUserPage>
      {component}
      <Modal 
        show={showModalSaveStudentChoices} 
        closeModal={() => {
        dispatch(revertSaveStudentChoices());
        }} 
      >
        {modal}
      </Modal>
    </LoggedUserPage>
  )
}

export default CoursesSelectionPage;