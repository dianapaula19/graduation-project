import { t } from "i18next";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { loginToken } from "../../../../features/auth/loginSlice";
import { getCoursesAsync, getCoursesCourses, getCoursesStatus } from "../../../../features/user/admin/course/getCoursesSlice";
import { getTeachersAsync, getTeachersStatus } from "../../../../features/user/admin/user/getTeachersSlice";
import { getTeacherCoursesStatus } from "../../../../features/user/teacher/getTeacherCoursesSlice";
import { ApiStatus } from "../../../../features/Utils";
import FetchStatus from "../../../molecules/FetchStatus";
import CoursesList from "../../../molecules/lists/CoursesList/CoursesList";
import LoggedUserPage from "../../../templates/LoggedUserPage";
import "./CoursesPage.scss";

const CoursesPage = () => {

  const { t } = useTranslation("pages");

  const componentClassName = "admin-courses-page";

  const courses = useAppSelector(getCoursesCourses);
  const statusGetCourses = useAppSelector(getCoursesStatus);
  const statusGetTeachers = useAppSelector(getTeacherCoursesStatus);
  const token = useAppSelector(loginToken)
  const dispatch = useAppDispatch();

  useEffect(() => {
  if (
    statusGetCourses === ApiStatus.idle &&
    token
  ) {
    dispatch(getCoursesAsync({
      token: token
    }));
  }
  if (
    statusGetTeachers === ApiStatus.idle &&
    token
  ) {
    dispatch(getTeachersAsync({
      token: token
    }));
  }
  }, [statusGetCourses, statusGetTeachers, token]);
  
  if (
    statusGetCourses === ApiStatus.loading || 
    statusGetTeachers === ApiStatus.loading
  ) {
    return (
      <LoggedUserPage>
        <FetchStatus 
          status={ApiStatus.loading} 
        />
      </LoggedUserPage>
    );
  }

  if (
    statusGetCourses === ApiStatus.failed ||
    statusGetTeachers === ApiStatus.failed
  ) {
    return (
      <LoggedUserPage>
        <FetchStatus 
          status={ApiStatus.failed}
          message={t("courses.error.fetch")} 
        />
      </LoggedUserPage>
    );
  } 
  
  return (
  <LoggedUserPage>
    <div
      className={componentClassName}
    >
      <span
        className={`${componentClassName}__title`}
      >
        {t("admin.courses.title")}
      </span>
      <CoursesList courses={courses ? courses : []}/>
    </div>
  </LoggedUserPage>
  )
}

export default CoursesPage;