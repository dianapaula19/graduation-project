import React from "react";
import SideNav from "../../molecules/SideNav/SideNav";
import "./LoggedUserPage.scss";
import { ILoggedUserPageProps } from "./LoggedUserPage.types";

const LoggedUserPage = ({
    children
}: ILoggedUserPageProps) => {

    const componentClassName = "logged-user-template";

    return (
        <div 
            className={componentClassName}
        >
            <SideNav />
            <div
                className={`${componentClassName}__content`}
            >
                {children}
            </div>
        </div>
    )
}

export default LoggedUserPage;