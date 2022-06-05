import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";
import { loginStatus } from "../../../features/auth/loginSlice";
import { ApiStatus } from "../../../features/Utils";
import SideNav from "../../molecules/SideNav/SideNav";
import "./LoggedUserPage.scss";
import { ILoggedUserPageProps } from "./LoggedUserPage.types";

const LoggedUserPage = ({
    children
}: ILoggedUserPageProps) => {

    const componentClassName = "logged-user-template";

    const status = useAppSelector(loginStatus);
    let navigate = useNavigate();

    useEffect(() => {
      if (status !== ApiStatus.success) {
        navigate('login');
      }
    }, [])
    

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