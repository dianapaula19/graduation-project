import { useAppSelector } from "app/hooks";
import SideNav from "components/organisms/SideNav";
import { loginStatus } from "features/account/loginSlice";
import { ApiStatus } from "features/Utils";
import { Navigate } from "react-router-dom";
import "./LoggedUserPage.scss";
import { ILoggedUserPageProps } from "./LoggedUserPage.types";

const LoggedUserPage = ({
  children
}: ILoggedUserPageProps) => {

  const componentClassName = "logged-user-template";

  const status = useAppSelector(loginStatus);

  if (status !== ApiStatus.success) {
    return <Navigate to={"/login"} />
  }

  return (
    <div 
      className={componentClassName}
    >
      <SideNav />
      <div
        className={`${componentClassName}__layout`}
      >
        <div className={`${componentClassName}__layout__content`}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default LoggedUserPage;