import React from "react";
import { Navigate } from "react-router-dom";
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

    if (status !== ApiStatus.success) {
        return <Navigate to="/login"/>
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