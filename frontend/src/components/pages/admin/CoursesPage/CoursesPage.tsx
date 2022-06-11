import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { getCoursesAsync, getCoursesCourses, getCoursesStatus } from "../../../../features/user/admin/getCoursesSlice";
import { getTeachersAsync, getTeachersStatus } from "../../../../features/user/admin/getTeachersSlice";
import { getTeacherCoursesStatus } from "../../../../features/user/teacher/getTeacherCoursesSlice";
import { ApiStatus } from "../../../../features/Utils";
import CoursesList from "../../../molecules/lists/CoursesList/CoursesList";
import LoggedUserPage from "../../../templates/LoggedUserPage";

const CoursesPage = () => {

  const courses = useAppSelector(getCoursesCourses);
  const statusGetCourses = useAppSelector(getCoursesStatus);
  const statusGetTeachers = useAppSelector(getTeacherCoursesStatus);
  const dispatch = useAppDispatch();

  useEffect(() => {
  if (
    statusGetCourses === ApiStatus.idle || 
    statusGetCourses === ApiStatus.failed
  ) {
    dispatch(getCoursesAsync());
  }
  if (
    statusGetTeachers === ApiStatus.idle || 
    statusGetTeachers === ApiStatus.failed
  ) {
    dispatch(getTeachersAsync());
  }
  }, []);
  
  return (
  <LoggedUserPage>
    <CoursesList courses={courses ? courses : []}/>
  </LoggedUserPage>
  )
}

export default CoursesPage;