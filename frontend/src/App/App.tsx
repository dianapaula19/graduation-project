import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import OptionalCoursesSelectionPage from '../components/pages/student/OptionalCoursesSelectionPage';
import OptionalCoursesList from '../components/pages/teacher/OptionalCoursesList';
import AuthentificationPage from '../components/templates/AuthentificationPage/AuthentificationPage';
import { AuthentificationAction } from '../components/templates/AuthentificationPage/AuthentificationPage.types';

function App() {
  return (
    <Suspense fallback="loading">
      <BrowserRouter>
        <Routes>
          <Route 
            path="login" 
            element={
              <AuthentificationPage 
                action={AuthentificationAction.login} 
              />} 
            />
          <Route 
            path="register" 
            element={
              <AuthentificationPage 
                action={AuthentificationAction.register} 
              />} 
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
        </Routes>
      </BrowserRouter>  
    </Suspense>
  );
}

export default App;
