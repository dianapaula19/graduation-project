import { useAppSelector, useAppDispatch } from "app/hooks";
import CourseCard from "components/molecules/CourseCard";
import LoggedUserPage from "components/templates/LoggedUserPage";
import { loginUserData, loginToken } from "features/account/loginSlice";
import { getStudentCoursesStatus, getStudentCoursesCourses, getStudentCoursesAsync } from "features/user/student/getStudentCoursesSlice";
import { ApiStatus } from "features/Utils";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./CoursesPage.scss";

const CoursesPage = () => {

  const componentClassName = "student-courses-page";
  
  const statusGetStudentCourses = useAppSelector(getStudentCoursesStatus);
  const userData = useAppSelector(loginUserData);
  const token = useAppSelector(loginToken);
  const courses = useAppSelector(getStudentCoursesCourses);

  const dispatch = useAppDispatch();

  const { t } = useTranslation("pages");

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
  }, [
    statusGetStudentCourses,
    dispatch,
    token,
    userData
  ])
  
  
  return (
    <LoggedUserPage>
      <div
        className={componentClassName}
      >
        <span
          style={{
            'fontSize': 'xx-large'
          }}
        >
        {t("student.courses.text.message")}
        </span>
        <span
          style={{
            'fontSize': 'x-large'
          }}
        >
          {t("common:text.firstSemester")}
        </span>
        {courses && courses.filter(course => course.semester === 1).map((course) => {
          return (
            <CourseCard 
              courseTitle={course.title} 
              teacherName={course.teacher_first_name + " " + course.teacher_last_name} 
              teacherEmail={course.teacher_email} 
            />
          )
        })}
        <span
          style={{
            'fontSize': 'x-large'
          }}
        >
          {t("common:text.secondSemester")}
        </span>
        {courses && courses.filter(course => course.semester === 2).map((course) => {
          return (
            <CourseCard 
              courseTitle={course.title} 
              teacherName={course.teacher_first_name + " " + course.teacher_last_name} 
              teacherEmail={course.teacher_email} 
            />
          )
        })}
      </div>
    </LoggedUserPage>
  )
};

export default CoursesPage;