import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import PersonalDataPage from '../pages/PersonalDataPage';
import AccountsPage from '../pages/secretary/AccountsPage';
import OptionalCoursesSelectionPage from '../pages/student/OptionalCoursesSelectionPage';
import OptionalCoursesList from '../pages/teacher/Courses';
import AuthentificationPage from '../templates/AuthentificationPage/';
import { AuthentificationAction } from '../templates/AuthentificationPage/';

const App = () => {
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
            path="/"
            element={<PersonalDataPage />}
          />
          <Route 
            path="student/select"
            element={
              <OptionalCoursesSelectionPage />
            }
          />
          <Route
            path="teacher/list"
            element={
              <OptionalCoursesList />
            }
          />
          <Route 
            path="secretary/accounts"
            element={
              <AccountsPage />
            }
          />
        </Routes>
      </BrowserRouter>  
    </Suspense>
  );
}

export default App;
