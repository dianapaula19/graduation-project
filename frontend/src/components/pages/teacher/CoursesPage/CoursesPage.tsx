import React, { useEffect, useState } from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { useAppSelector, useAppDispatch } from "app/hooks";
import Button, { ButtonModifier } from "components/atoms/Button";
import DropDown from "components/atoms/DropDown";
import Modal from "components/molecules/Modal";
import SendAnnouncementForm from "components/organisms/forms/SendAnnouncementForm";
import StudentsList from "components/organisms/lists/StudentsList";
import LoggedUserPage from "components/templates/LoggedUserPage";
import { loginUserData, loginToken } from "features/account/loginSlice";
import { getTeacherCoursesStatus, getTeacherCoursesCourses, getTeacherCoursesCurrentCourse, getCurrentTeacherCourse, getTeacherCoursesAsync } from "features/user/teacher/getTeacherCoursesSlice";
import { ApiStatus } from "features/Utils";
import { useTranslation } from "react-i18next";
import "./CoursesPage.scss";
import { PLACEHOLDER } from "components/Utils";
import { revertSendAnnouncement, sendAnnouncementShowModal, sendAnnouncementStatus } from "features/user/teacher/sendAnnouncementSlice";
import ModalApiStatus from "components/molecules/ModalApiStatus";

const OptionalCoursesList = () => {

  const componentClassName = "teacher-courses-page";

  const statusTeacherCourses = useAppSelector(getTeacherCoursesStatus);
  const statusSendAnnouncement = useAppSelector(sendAnnouncementStatus);
  const showModalSendAnnouncement = useAppSelector(sendAnnouncementShowModal);
  const courses = useAppSelector(getTeacherCoursesCourses);
  const currentCourse = useAppSelector(getTeacherCoursesCurrentCourse);
  const userData = useAppSelector(loginUserData);
  const token = useAppSelector(loginToken);

  const dispatch = useAppDispatch();

  const fileType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

  const { t } = useTranslation('pages');

  const [showSendAnnouncementFormModal, setShowSendAnnouncementFormModal] = useState<boolean>(false);
  const [courseId, setCourseId] = useState<string | number>(PLACEHOLDER);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = e.target.value;  
    dispatch(getCurrentTeacherCourse({
      id: parseInt(value)
    }));
    setCourseId(parseInt(value));

  }

  const exportToExcel = () => {
    const header = [t("teacher.courses.xlsx.fullName"), t("teacher.courses.xlsx.email")];
    const ws = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(ws, [header]);
    currentCourse?.students.forEach((student) => {
      XLSX.utils.sheet_add_aoa(ws, 
        [[`${student.first_name} ${student.last_name}`, student.email]],
        {origin: -1}  
      )
    })

    const wb = { Sheets: {"data": ws}, SheetNames: ["data"]}
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array"});
    const data = new Blob([excelBuffer], { type: fileType})
    FileSaver.saveAs(data, currentCourse?.title + " - " + t("teacher.courses.xlsx.title") + ".xlsx");
  }

  useEffect(() => {
    if (userData && token && statusTeacherCourses === ApiStatus.idle) {
      dispatch(getTeacherCoursesAsync({
        email: userData.email,
        token: token
      }));
    }
    if (statusSendAnnouncement !== ApiStatus.idle) {
      setShowSendAnnouncementFormModal(false);
    }
  }, [
    courses,
    dispatch,
    statusTeacherCourses,
    statusSendAnnouncement,
    token,
    userData
  ])
  

  return (
    <LoggedUserPage>
      <div 
        className={componentClassName}
      >   
        <DropDown 
          error={false} 
          name={"course"}
          value={courseId}
          placeholder={t("teacher.courses.dropDownFields.chooseCourse.placeholder")}
          label={t("teacher.courses.dropDownFields.chooseCourse.label")}
          onChange={handleChange}
        >
          {courses && courses.map((course) => {
            return (
              <option
                value={course.id}
              >
                {course.title}
              </option>
            )
          })}
        </DropDown>
        {currentCourse && currentCourse.students && currentCourse.students.length > 0 && (
          <>
            <StudentsList students={currentCourse?.students}/>
            <Button 
              label={t("teacher.courses.mailButton")}
              modifier={ButtonModifier.mail} 
              onClick={() => {setShowSendAnnouncementFormModal(true)}}
              disabled={false} 
            />
            <Button 
              label={t("teacher.courses.excelButton")}
              modifier={ButtonModifier.excel} 
              onClick={exportToExcel}
              disabled={false} 
            />  
          </>  
        ) }
        <Modal
          show={showSendAnnouncementFormModal}
          closeModal={() => {
            setShowSendAnnouncementFormModal(false)
          }}        
        >
          <SendAnnouncementForm />
        </Modal>
        <Modal
          show={showModalSendAnnouncement}
          closeModal={() => {
            dispatch(revertSendAnnouncement());
          }}        
        > 
          <ModalApiStatus 
            message={statusSendAnnouncement === ApiStatus.success ? t("teacher.courses.success") : t("teacher.courses.error")} 
            status={statusSendAnnouncement} 
          /> 
        </Modal>
      </div>

    </LoggedUserPage>
  )

}

export default OptionalCoursesList;