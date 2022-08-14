import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loginSelectionSessionOpen, loginStatus, loginUserData, revertLogin, setSelectionSessionOpenSetting } from '../../features/auth/loginSlice';
import OptionsListsPage from '../pages/admin/OptionsListsPage';
import AdminCoursesPage from '../pages/admin/CoursesPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegistrationPage';
import ProfilePage from '../pages/ProfilePage';
import AccountsPage from '../templates/AccountsPage';
import CoursesSelectionPage from '../pages/student/CoursesSelectionPage';
import StudentCoursesPage from "../pages/student/CoursesPage";
import TeacherCoursesPage from '../pages/teacher/CoursesPage';
import { Role, Time } from './App.types';
import RecoverAccountPage from '../pages/auth/RecoverAccountPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import SettingsPage from '../pages/admin/SettingsPage';
import { ApiStatus, SelectionSessionSettingValue } from '../../features/Utils';
import { revertUpdateSelectionSessionOpen, updateSelectionSessionOpenStatus } from '../../features/user/admin/updateSelectionSessionOpenSlice';
import NotFoundPage from '../pages/NotFoundPage';
import { updateCourseStatus } from '../../features/user/admin/course/updateCourseSlice';
import { createCourseStatus } from '../../features/user/admin/course/createCourseSlice';
import { createOptionsListStatus } from '../../features/user/admin/optionsList/createOptionsListSlice';
import { updateOptionsListStatus } from '../../features/user/admin/optionsList/updateOptionsListSlice';
import { verifyUserStatus } from '../../features/user/admin/user/verifyUserSlice';
import { updateStudentInfoStatus } from '../../features/user/admin/user/updateStudentInfoSlice';
import { updateTeacherInfoStatus } from '../../features/user/admin/user/updateTeacherInfoSlice';
import { registerBatchStudentsStatus } from '../../features/user/admin/user/registerBatchStudentsSlice';
import { registerBatchTeachersStatus } from '../../features/user/admin/user/registerBatchTeachersSlice';
import LoadingPage from '../pages/LoadingPage';
import { recoverAccountStatus } from '../../features/auth/recoverAccountSlice';
import { resetPasswordStatus } from '../../features/auth/resetPasswordSlice';

const App = () => {

  const userData = useAppSelector(loginUserData);
  const selectionSessionOpen = useAppSelector(loginSelectionSessionOpen);
  const statusUpdateSelectionSessionOpen = useAppSelector(updateSelectionSessionOpenStatus);
  const dispatch = useAppDispatch();
  const statusLogin = useAppSelector(loginStatus);
  const [role, setRole] = useState(Role.NONE);

  useEffect(() => {

    setTimeout(() => {
      if (statusLogin === ApiStatus.loading) {
        dispatch(revertLogin());
      }
    }, Time.SECOND * 5);

    if (statusLogin === ApiStatus.success) {
      setTimeout(() => {
        dispatch(revertLogin());
      }, Time.DAY)
    }

    if (userData && role === Role.NONE) {
      setRole(userData.role)
    }

    if (statusUpdateSelectionSessionOpen === ApiStatus.success) {
      let url = `ws://localhost:8000/ws/socket-server/`
  
      const socket = new WebSocket(url);
      socket.onmessage = (e) => {
      let data = JSON.parse(e.data);
      if (data.type === 'set_selection_session_open') {
          dispatch(setSelectionSessionOpenSetting({
            value: data.SELECTION_SESSION_OPEN as SelectionSessionSettingValue
          }))
          dispatch(revertUpdateSelectionSessionOpen())
        }
      }
      socket.onopen = () => {
          socket.send(JSON.stringify({
          'status': 'SUCCESS'
        }))  
      }
    }
  
  }, [
    userData, 
    setRole, 
    role, 
    statusUpdateSelectionSessionOpen
  ]);

  const statusRegisterBatchStudents = useAppSelector(registerBatchStudentsStatus);
  const statusRegisterBatchTeachers = useAppSelector(registerBatchTeachersStatus);

  if (
    statusRegisterBatchStudents === ApiStatus.loading ||
    statusRegisterBatchTeachers === ApiStatus.loading
  ) {
    return (
      <LoadingPage />
    )
  }
  
  return (
  <>
    <Suspense fallback="loading">
      <BrowserRouter>
        <Routes>
          <Route 
            path="login" 
            element={<LoginPage />} 
          />
          <Route 
            path="register" 
            element={<RegisterPage />} 
          />
          <Route 
            path="recoverAccount"
            element={<RecoverAccountPage />}
          />
          <Route 
            path="resetPassword"
            element={<ResetPasswordPage />}
          />
          <Route 
            path="/"
            element={<ProfilePage />}
          />
          {selectionSessionOpen && (
            <>
              <Route 
                path="admin/optionsLists"
                element={<OptionsListsPage />}
              />
              <Route
                path="admin/courses"
                element={<AdminCoursesPage />}
              />
              <Route 
                path="admin/accounts/notVerified"
                element={<AccountsPage role={Role.NONE}/>}
              />
              <Route 
                path="admin/accounts/students"
                element={<AccountsPage role={Role.STUDENT}/>}
              />
              <Route 
                path="admin/accounts/teachers"
                element={<AccountsPage role={Role.TEACHER}/>}
              />
              <Route
                path="admin/settings"
                element={<SettingsPage />}
              />
                <Route 
                  path="student/courses"
                  element={selectionSessionOpen === SelectionSessionSettingValue.FALSE ? <StudentCoursesPage /> : <CoursesSelectionPage />}
                />      
                <Route
                  path="teacher/courses"
                  element={
                    <TeacherCoursesPage />
                  }
                />
            </>
          )}
          <Route path="*" element={<NotFoundPage />} />      
        </Routes>
      </BrowserRouter>  
    </Suspense>
  </>
  
  );
}

export default App;
