import { useAppDispatch, useAppSelector } from "app/hooks";
import Modal from "components/molecules/Modal";
import ModalApiStatus from "components/molecules/ModalApiStatus";
import FetchStatus from "components/molecules/ModalFetchStatus";
import OptionsCoursesContainer from "components/molecules/OptionsCoursesContainer";
import { IOptionalCourseCard } from "components/molecules/OptionsCoursesContainer/OptionsCoursesContainer.types";
import LoggedUserPage from "components/templates/LoggedUserPage";
import { loginUserData, loginToken } from "features/account/loginSlice";
import { saveStudentChoicesShowModal, saveStudentChoicesStatus, revertSaveStudentChoices } from "features/user/student/saveStudentChoicesSlice";
import { studentOptionalsListsStatus, studentOptionalsLists, studentOptionalsListsAsync } from "features/user/student/studentOptionalsListsSlice";
import { ApiStatus } from "features/Utils";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

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
    if (
      statusStudentOptionsLists === ApiStatus.idle && 
      userData && 
      token
    ) {
      dispatch(studentOptionalsListsAsync({
        email: userData.email,
        token: token
      }))
    }
  }, [
    dispatch,
    statusStudentOptionsLists,
    token,
    userData
  ])

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
          { studentOptionsLists !== null && studentOptionsLists.filter((optionsList) => optionsList.semester === 1).map((optionsList) => {
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
              <OptionsCoursesContainer 
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
          { studentOptionsLists !== null && studentOptionsLists.filter((optionsList) => optionsList.semester === 2).map((optionsList) => {
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
              <OptionsCoursesContainer 
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