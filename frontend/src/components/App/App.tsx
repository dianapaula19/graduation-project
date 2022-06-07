import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { loginUserData } from '../../features/auth/loginSlice';
import OptionsListsPage from '../pages/admin/OptionsListsPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import PersonalDataPage from '../pages/PersonalDataPage';
import AccountsPage from '../templates/AccountsPage';
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
              path="admin/accounts"
              element={<AccountsPage role={Role.STUDENT} />}
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
            path="admin/accounts/secretaries"
            element={<AccountsPage role={Role.SECRETARY}/>}
          />
          <Route 
            path="/"
            element={<PersonalDataPage />}
          />
            <Route 
              path="student/optionals"
              element={
                <OptionalCoursesSelectionPage />
              }
            />  
          
            <Route
              path="teacher/courses"
              element={
                <OptionalCoursesList />
              }
            />  
          
            <Route 
              path="secretary/accounts"
              element={<AccountsPage role={Role.STUDENT} />}
            />  
          
        </Routes>
      </BrowserRouter>  
    </Suspense>
  );
}

export default App;
