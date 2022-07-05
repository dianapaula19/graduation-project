import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { loginToken } from "../../../../features/auth/loginSlice";
import { getCoursesAsync, getCoursesCourses, getCoursesStatus } from "../../../../features/user/admin/course/getCoursesSlice";
import { getTeachersAsync, getTeachersStatus } from "../../../../features/user/admin/user/getTeachersSlice";
import { getTeacherCoursesStatus } from "../../../../features/user/teacher/getTeacherCoursesSlice";
import { ApiStatus } from "../../../../features/Utils";
import CoursesList from "../../../molecules/lists/CoursesList/CoursesList";
import LoggedUserPage from "../../../templates/LoggedUserPage";

const CoursesPage = () => {

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
  
  return (
  <LoggedUserPage>
    <CoursesList courses={courses ? courses : []}/>
  </LoggedUserPage>
  )
}

export default CoursesPage;