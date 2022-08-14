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
import { registerBatchStudentsStatus, revertRegisterBatchStudents } from '../../features/user/admin/user/registerBatchStudentsSlice';
import { registerBatchTeachersStatus, revertRegisterBatchTeachers } from '../../features/user/admin/user/registerBatchTeachersSlice';
import LoadingPage from '../pages/LoadingPage';
import { revertVerifyUser, verifyUserStatus } from '../../features/user/admin/user/verifyUserSlice';
import { revertSendAnnouncement, sendAnnouncementStatus } from '../../features/user/teacher/sendAnnouncementSlice';
import { getStudentsListsStatus, revertGetStudentsLists } from '../../features/user/admin/user/getStudentsListsSlice';

const App = () => {

  const userData = useAppSelector(loginUserData);
  const selectionSessionOpen = useAppSelector(loginSelectionSessionOpen);
  const statusUpdateSelectionSessionOpen = useAppSelector(updateSelectionSessionOpenStatus);
  const dispatch = useAppDispatch();
  const statusLogin = useAppSelector(loginStatus);
  const statusRegisterBatchStudents = useAppSelector(registerBatchStudentsStatus);
  const statusRegisterBatchTeachers = useAppSelector(registerBatchTeachersStatus);
  const statusVerifyUser = useAppSelector(verifyUserStatus);
  const statusSendAnnouncement = useAppSelector(sendAnnouncementStatus);
  const [role, setRole] = useState(Role.NONE);

  useEffect(() => {

    if (statusLogin === ApiStatus.success) {
      setTimeout(() => {
        dispatch(revertLogin());
      }, Time.DAY)
    }

    if (userData && role === Role.NONE) {
      setRole(userData.role)
    }
  
  }, [
    userData, 
    setRole, 
    role
  ]);

  if (
    statusLogin === ApiStatus.loading ||
    statusRegisterBatchStudents === ApiStatus.loading ||
    statusRegisterBatchTeachers === ApiStatus.loading ||
    statusVerifyUser === ApiStatus.loading ||
    statusSendAnnouncement === ApiStatus.loading ||
    statusUpdateSelectionSessionOpen === ApiStatus.loading
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
