import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { loginToken, loginUserData } from "../../../../features/auth/loginSlice";
import { getStudentCoursesAsync, getStudentCoursesCode, getStudentCoursesCourses, getStudentCoursesStatus } from "../../../../features/user/student/getStudentCoursesSlice";
import { ApiStatus } from "../../../../features/Utils";
import LoggedUserPage from "../../../templates/LoggedUserPage";
import "./CoursesPage.scss";

const CoursesPage = () => {

  const componentClassName = "courses-page";
  
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
      <div
        className={componentClassName}
      >
        <div
          style={{
            'fontSize': 'xx-large'
          }}
        >Ai fost repartizat/ă la optionalele de mai jos</div>
        <span
          style={{
            'fontSize': 'x-large'
          }}
        >
          Semestrul I
        </span>
        {courses && courses.filter(course => course.semester === 1).map((course) => {
          return (
            <div
              style={{
                'fontSize': 'larger'
              }}
            >
              {course.title}
            </div> 
          )
        })}
        <span
          style={{
            'fontSize': 'x-large'
          }}
        >
          Semestrul al II-lea
        </span>
        {courses && courses.filter(course => course.semester === 2).map((course) => {
          return (
            <div
              style={{
                'fontSize': 'larger'
              }}
            >
              {course.title}
            </div>
          )
        })}
      </div>
    </LoggedUserPage>
  )
};

export default CoursesPage;