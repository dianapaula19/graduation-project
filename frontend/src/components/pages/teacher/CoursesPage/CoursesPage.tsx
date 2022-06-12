import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button, { ButtonModifier } from "../../../atoms/Button";
import StudentsList from "../../../molecules/lists/StudentsList";
import LoggedUserPage from "../../../templates/LoggedUserPage";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import DropDown from "../../../atoms/DropDown";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import Modal from "../../../molecules/Modal";
import { getCurrentTeacherCourse, getTeacherCoursesAsync, getTeacherCoursesCode, getTeacherCoursesCourses, getTeacherCoursesCurrentCourse, getTeacherCoursesStatus } from "../../../../features/user/teacher/getTeacherCoursesSlice";
import { loginToken, loginUserData } from "../../../../features/auth/loginSlice";
import { ApiStatus } from "../../../../features/Utils";
import SendAnnouncementForm from "../../../molecules/forms/SendAnnouncementForm";
import "./CoursesPage.scss";

const OptionalCoursesList = () => {

  const componentClassName = "courses";

  const statusTeacherCourses = useAppSelector(getTeacherCoursesStatus);
  const courses = useAppSelector(getTeacherCoursesCourses);
  const currentCourse = useAppSelector(getTeacherCoursesCurrentCourse);
  const userData = useAppSelector(loginUserData);
  const token = useAppSelector(loginToken);

  const dispatch = useAppDispatch();

  const fileType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

  const { t } = useTranslation();

  const [showSendAnnouncementFormModal, setShowSendAnnouncementFormModal] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = e.target.value;  
    dispatch(getCurrentTeacherCourse({
      id: parseInt(value)
    }));

  }

  const exportToExcel = () => {
    const header = [t("studentsList.header.name"), t("studentsList.header.email")];
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
    FileSaver.saveAs(data, "List.xlsx");
  }

  useEffect(() => {
    if (userData && token && statusTeacherCourses === ApiStatus.idle) {
    dispatch(getTeacherCoursesAsync({
      email: userData.email,
      token: token
    }));
    }
  }, [courses])
  

  return (
    <LoggedUserPage>
      <div 
        className={componentClassName}
      >   
        <DropDown 
          error={false} 
          errorMessage={""} 
          name={"course"}
          defaultValue="placeholder"
          placeholder={"Choose an optional course"}
          label={"Choose an optional course"}
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
              label={t("excelButton")}
              modifier={ButtonModifier.excel} 
              onClick={exportToExcel}
              disabled={false} 
            />
            <Modal
              show={showSendAnnouncementFormModal}
              closeModal={() => {setShowSendAnnouncementFormModal(false)}}        
            >
              <SendAnnouncementForm />
            </Modal>  
          </>  
        ) }
      </div>
    </LoggedUserPage>
  )

}

export default OptionalCoursesList;