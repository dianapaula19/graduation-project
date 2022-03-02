import React from "react";
import SideNav from "../../molecules/SideNav/SideNav";
import "./LoggedUserPage.scss";

const LoggedUserPage = () => {

    const componentClassName = "logged-user-template";

    return (
        <div 
            className={componentClassName}
        >
            <SideNav />
            <div
                className={`${componentClassName}__content`}
            >

            </div>
        </div>
    )
}

export default LoggedUserPage;