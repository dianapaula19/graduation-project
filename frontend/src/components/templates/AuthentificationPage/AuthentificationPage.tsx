import React from "react";
import Languages from "../../atoms/LanguagesSwitch/LanguageSwitch";
import LoginForm from "../../molecules/forms/LoginForm/LoginForm";
import RegistrationForm from "../../molecules/forms/RegistrationForm/RegistrationForm";
import { IAuthentificationPageProps, AuthentificationAction } from "./AuthentificationPage.types";
import LoginSvg from "./assets/login.svg";
import RegistrationSvg from "./assets/registration.svg";
import LogoSvg from "../../../assets/logo.svg";
import "./AuthentificationPage.scss";

const AuthentificationPage = ({
    action
}
: IAuthentificationPageProps) => {

    const componentClassName = "authentification-template";
    const mainClassName = `${componentClassName}__main`;
    const imageClassName = `${mainClassName}__image-container`;
    const formClassName = `${mainClassName}__form-container`;

    let form = null;
    let image = null;

    switch (action) {
        case AuthentificationAction.register:
            form = <RegistrationForm />;
            image = RegistrationSvg;
            break;
        case AuthentificationAction.login:
            form = <LoginForm />;
            image = LoginSvg;
            break;
    }

    return(
        <div className={componentClassName}>
            <Languages/>

            <div className={mainClassName}>
                <div className={imageClassName}>
                    <img
                        src={image}
                        className={`${imageClassName}__img`}
                    />
                </div>
                <div className={formClassName}>
                    {form}
                </div>
            </div>
        </div>
    )
}

export default AuthentificationPage;