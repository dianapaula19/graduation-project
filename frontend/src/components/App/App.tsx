import { useAppSelector, useAppDispatch } from "app/hooks";
import LoginPage from "components/pages/account/LoginPage";
import RecoverAccountPage from "components/pages/account/RecoverAccountPage";
import RegistrationPage from "components/pages/account/RegistrationPage";
import ResetPasswordPage from "components/pages/account/ResetPasswordPage";
import AccountsPage from "components/pages/admin/AccountsPage";
import AdminCoursesPage from "components/pages/admin/CoursesPage";
import OptionsListsPage from "components/pages/admin/OptionsListsPage";
import SettingsPage from "components/pages/admin/SettingsPage";
import NotFoundPage from "components/pages/NotFoundPage";
import ProfilePage from "components/pages/ProfilePage";
import StudentCoursesPage from "components/pages/student/CoursesPage";
import CoursesSelectionPage from "components/pages/student/CoursesSelectionPage";
import TeacherCoursesPage from "components/pages/teacher/CoursesPage";
import { loginUserData, loginSelectionSessionOpen, loginStatus, revertLogin } from "features/account/loginSlice";
import { ApiStatus, SelectionSessionSettingValue } from "features/Utils";
import { useState, useEffect, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Role, Time } from "./App.types";

const App = () => {

  const userData = useAppSelector(loginUserData);
  const selectionSessionOpen = useAppSelector(loginSelectionSessionOpen);
  const dispatch = useAppDispatch();
  const statusLogin = useAppSelector(loginStatus);
  const [role, setRole] = useState(Role.NONE);

  useEffect(() => {

    if (statusLogin === ApiStatus.success) {
      setTimeout(() => {
        dispatch(revertLogin());
      }, Time.DAY)
    }

    if (
      userData && 
      role === Role.NONE
    ) {
      setRole(userData.role)
    }
  
  }, [
    userData, 
    setRole, 
    role,
    dispatch,
    statusLogin
  ]);
  
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
            element={<RegistrationPage />} 
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
