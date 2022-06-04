import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { loginUserData } from '../../features/auth/loginSlice';
import OptionsListsPage from '../pages/admin/OptionsListsPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import PersonalDataPage from '../pages/PersonalDataPage';
import AccountsPage from '../pages/secretary/AccountsPage';
import OptionalCoursesSelectionPage from '../pages/student/OptionalCoursesSelectionPage';
import OptionalCoursesList from '../pages/teacher/Courses';
import AuthentificationPage from '../templates/AuthentificationPage/';
import { AuthentificationAction } from '../templates/AuthentificationPage/';
import { Role } from './App.types';

const App = () => {

  const userData = useAppSelector(loginUserData);
  const role = userData?.role;

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
            element={
              <AuthentificationPage 
                action={AuthentificationAction.recoverAccount}                
              />
            }
          />
          <Route 
            path="resetPassword"
            element={
              <AuthentificationPage 
                action={AuthentificationAction.resetPassword}
              />
            }
          />
          <Route 
            path="admin/optionsLists"
            element={<OptionsListsPage />}
          />
          <Route 
            path="/"
            element={<PersonalDataPage />}
          />
          {role === Role.student && (
            <Route 
              path="student/optionals"
              element={
                <OptionalCoursesSelectionPage />
              }
            />  
          )}
          {role === Role.teacher && (
            <Route
              path="teacher/courses"
              element={
                <OptionalCoursesList />
              }
            />  
          )}
          {role === Role.secretary && (
            <Route 
              path="secretary/accounts"
              element={
                <AccountsPage />
              }
            />  
          )}
        </Routes>
      </BrowserRouter>  
    </Suspense>
  );
}

export default App;
