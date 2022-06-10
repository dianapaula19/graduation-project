import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { getCoursesAsync, getCoursesCourses, getCoursesStatus } from "../../../../features/user/admin/getCoursesSlice";
import { getTeachersStatus } from "../../../../features/user/admin/getTeachersSlice";
import { ApiStatus } from "../../../../features/Utils";
import CoursesList from "../../../molecules/lists/CoursesList/CoursesList";
import LoggedUserPage from "../../../templates/LoggedUserPage";

const CoursesPage = () => {

  const courses = useAppSelector(getCoursesCourses);
  const statusGetCourses = useAppSelector(getCoursesStatus);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (statusGetCourses === ApiStatus.idle || statusGetCourses === ApiStatus.failed) {
      dispatch(getCoursesAsync());
    }
  }, []);
  
  return (
    <LoggedUserPage>
      <CoursesList courses={courses ? courses : []}/>
    </LoggedUserPage>
  )
}

export default CoursesPage;