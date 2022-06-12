import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { loginToken, loginUserData } from "../../../../features/auth/loginSlice";
import { getStudentCoursesAsync, getStudentCoursesCode, getStudentCoursesCourses, getStudentCoursesStatus } from "../../../../features/user/student/getStudentCoursesSlice";
import { ApiStatus } from "../../../../features/Utils";
import LoggedUserPage from "../../../templates/LoggedUserPage";

const CoursesPage = () => {
  
  const statusGetStudentCourses = useAppSelector(getStudentCoursesStatus);
  const userData = useAppSelector(loginUserData);
  const token = useAppSelector(loginToken);
  const courses = useAppSelector(getStudentCoursesCourses);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      (statusGetStudentCourses === ApiStatus.idle ||
      statusGetStudentCourses === ApiStatus.failed) &&
      userData &&
      token 
    ) {
      dispatch(getStudentCoursesAsync({
        email: userData.email,
        token: token
      }));
    }
  }, [statusGetStudentCourses])
  
  
  return (
    <LoggedUserPage>
      <div>

        <span>Semester 1</span>
        {courses && courses.filter(course => course.semester === 1).map((course) => {
          return (
            <>
              <br/>
              <span>{course.title}</span>
              <br/>
            </>
          )
        })}
        <br/>
        <span>Semester 2</span>
        {courses && courses.filter(course => course.semester === 2).map((course) => {
          return (
            <>
              <br/>
              <span>{course.title}</span>
              <br/>
            </>
          )
        })}
      </div>
    </LoggedUserPage>
  )
};

export default CoursesPage;