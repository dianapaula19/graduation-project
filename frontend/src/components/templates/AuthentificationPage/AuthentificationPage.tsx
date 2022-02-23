import React from "react";
import Languages from "../../atoms/Languages/Languages";
import LoginForm from "../../molecules/LoginForm/LoginForm";
import RegistrationForm from "../../molecules/RegistrationForm/RegistrationForm";
import { AuthetificationPageProps, Action } from "./AuthentificationPage.types";
import "./AuthentificationPage.scss";

const AuthetificationPage = ({
    action
}
:AuthetificationPageProps
) => {

    const switchForm = (action: Action): JSX.Element =>{
        switch (action) {
            case Action.register:
                return <RegistrationForm/>
            case Action.login:
                return <LoginForm/>;
        }
    }

    return(
        <div className="authentification-template">
            <Languages/>
            {switchForm(action)}
        </div>
    )
}

export default AuthetificationPage;