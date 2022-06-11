import React, { ReactNode } from "react";
import LinkButton from "../../atoms/LinkButton/LinkButton";
import LogoSvg from "../../../assets/logo.svg";
import "./SideNav.scss";
import LanguageSwitch from "../../atoms/LanguagesSwitch/LanguageSwitch";
import { useTranslation } from "react-i18next";  
import { Time } from "./SideMenu.types";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../atoms/Button";
import { loginStatus, loginUserData, revertLogin } from "../../../features/auth/loginSlice";
import { revertStudentData } from "../../../features/user/student/studentDataSlice";
import { useAppSelector } from "../../../app/hooks";
import { adminLinks, studentLinks, teacherLinks } from "./Utils";
import { Role } from "../../App";
import { revertStudentOptionalsLists } from "../../../features/user/student/studentOptionalsListsSlice";
import { revertGetCourses } from "../../../features/user/admin/getCoursesSlice";
import { revertGetStudents } from "../../../features/user/admin/getStudentsSlice";
import { revertGetNotVerifiedUsers } from "../../../features/user/admin/getNotVerifiedUsersSlice";
import { revertGetTeachers } from "../../../features/user/admin/getTeachersSlice";
import { revertGetTeacherCourses } from "../../../features/user/teacher/getTeacherCoursesSlice";
import { revertGetOptionsLists } from "../../../features/user/admin/getOptionsListsSlice";
import { revertGetStudentCourses } from "../../../features/user/student/getStudentCoursesSlice";

const SideNav = () => {
  
  const dispatch = useDispatch();
  const userData = useAppSelector(loginUserData);

  const role = userData?.role;

  let navigate = useNavigate();

  const componentClassName = "side-nav";

  const { t } = useTranslation(); 

  let time: Time = null;

  let hr = (new Date()).getHours();

  if (hr >= 6 && hr < 12) {
    time = 'morning';
  } else if (hr >= 12 && hr <= 18 ) {
    time = 'afternoon';
  } else {
    time = 'night';
  }

  let displayMessage: string | null = null;
  let emoji: ReactNode | null = null;

  switch (time) {
    case 'morning':
      displayMessage = t("sidenav.displayMessage.morning");
      emoji = <span aria-label="sunflower">🌻</span>;
      break;
    case 'afternoon':
      displayMessage = t("sidenav.displayMessage.afternoon");
      emoji = <span aria-label="">👋</span>;
      break;
    case 'night':
      displayMessage = t("sidenav.displayMessage.night");
      emoji = <span aria-label="yawning-face">🥱</span>;
      break;
  }

  let links = null;
  let pathName: string = '';

  switch(role) {
    case Role.STUDENT:
      links = studentLinks;
      pathName = 'studentLinks'
      break;
    case Role.TEACHER:
      links = teacherLinks;
      pathName = 'teacherLinks'
      break;
    case Role.ADMIN:
      links = adminLinks;
      pathName = 'adminLinks'
      break;
    default:
      break;  
  }

  return(
    <div className={componentClassName}>
      <LanguageSwitch />
      <img
        src={LogoSvg}
        className={`${componentClassName}__logo`}

      />
      <div
        className={`${componentClassName}__welcome-message`}
      >
        <p>
          {displayMessage}, {userData !== null ? (userData.first_name) : ('FIRST_NAME')} 
          {emoji}
        </p>
      </div>
      <div 
        className={`${componentClassName}__links`}
      >   
        {(links !== null && pathName !== '') && links.map((link) => {
          return (
            <Button 
              label={t(`sidenav.${pathName}.${link.label}`)} 
              onClick={() => {
                navigate(link.path)
              }}
              disabled={false}          
            />
          )  
        })}
        <Button 
          label={t("sidenav.links.personalData")} 
          onClick={() => {
            navigate('/')
          }}
          disabled={false}          
        />
        <Button 
          label={t("sidenav.links.signOut")} 
          onClick={() => {
            dispatch(revertLogin());
            if (role === Role.STUDENT) {
              dispatch(revertStudentData());
              dispatch(revertStudentOptionalsLists());
              dispatch(revertGetStudentCourses());  
            }
            if (role === Role.TEACHER) {
              dispatch(revertGetTeacherCourses());
            }
            if (role === Role.ADMIN) {
              dispatch(revertGetStudents());
              dispatch(revertGetNotVerifiedUsers());
              dispatch(revertGetTeachers());
              dispatch(revertGetCourses());
              dispatch(revertGetOptionsLists());
            }
            navigate('/login');
          }}
          disabled={false}          
        />

      </div>
      <p
        className={`${componentClassName}__copyright`}
      >
        <span>
          © 2022
        </span>
        <br/>
        <span>
          {t("sidenav.facultyName")}
        </span>
      </p>

    </div>
  )
}

export default SideNav;