import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { loginSelectionSessionOpen, loginUserData } from '../../features/auth/loginSlice';
import OptionsListsPage from '../pages/admin/OptionsListsPage';
import AdminCoursesPage from '../pages/admin/CoursesPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import PersonalDataPage from '../pages/PersonalDataPage';
import AccountsPage from '../templates/AccountsPage';
import CoursesSelectionPage from '../pages/student/CoursesSelectionPage';
import StudentCoursesPage from "../pages/student/CoursesPage";
import TeacherCoursesPage from '../pages/teacher/CoursesPage';
import { Role } from './App.types';
import RecoverAccountPage from '../pages/auth/RecoverAccountPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import SettingsPage from '../pages/admin/SettingsPage';
import { SelectionSessionSettingValue } from '../../features/Utils';

const App = () => {

  const userData = useAppSelector(loginUserData);
  const selectionSessionOpen = useAppSelector(loginSelectionSessionOpen);
  const [role, setRole] = useState(Role.NONE);

  useEffect(() => {
    if (userData) {
      setRole(userData.role)
    }
  }, [])
  
  return (
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
          element={<PersonalDataPage />}
        />
        {selectionSessionOpen && (
          <>
            {role === Role.ADMIN && (
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
              </>
            )}
            {role === Role.STUDENT && (
              <>
                <Route 
                  path="student/courses"
                  element={selectionSessionOpen === SelectionSessionSettingValue.FALSE ? <StudentCoursesPage /> : <CoursesSelectionPage />}
                />      
              </>
            )}
            {role === Role.TEACHER && (
              <>
                <Route
                  path="teacher/courses"
                  element={
                    <TeacherCoursesPage />
                  }
                />
              </>      
            )}
          </>
        )}      
      </Routes>
    </BrowserRouter>  
  </Suspense>
  );
}

export default App;
