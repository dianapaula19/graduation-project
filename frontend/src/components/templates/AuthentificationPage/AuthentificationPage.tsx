import React, { useEffect, useState } from "react";
import Languages from "../../atoms/LanguagesSwitch/LanguageSwitch";
import LoginForm from "../../molecules/forms/LoginForm/LoginForm";
import RegistrationForm from "../../molecules/forms/RegistrationForm/RegistrationForm";
import RecoverAccountForm from "../../molecules/forms/RecoverAccountForm";
import ResetPasswordForm from "../../molecules/forms/ResetPasswordForm";
import { IAuthentificationPageProps, AuthentificationAction } from "./AuthentificationPage.types";
import LoginSvg from "./assets/login.svg";
import RegistrationSvg from "./assets/registration.svg";
import RecoverAccountSvg from "./assets/recover-account.svg";
import ResetPasswordSvg from "./assets/reset-password.svg";
import "./AuthentificationPage.scss";
import { useWindowDimensions } from "../../../app/hooks";

const AuthentificationPage = ({
  action
}
: IAuthentificationPageProps) => {

  const componentClassName = "authentification-template";
  const mainClassName = `${componentClassName}__main`;
  const imageClassName = `${mainClassName}__image-container`;
  const formClassName = `${mainClassName}__form-container`;

  const { height, width } = useWindowDimensions();

  const [resize, setResize] = useState(false);

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
    case AuthentificationAction.recoverAccount:
      form = <RecoverAccountForm />;
      image = RecoverAccountSvg;
      break;
    case AuthentificationAction.resetPassword:
      form = <ResetPasswordForm />;
      image = ResetPasswordSvg;
      break;
  }

  useEffect(() => {
    if (width < 750) {
      setResize(true);
    } else {
      setResize(false);
    }

  }, [width, setResize])
  

  return(
    <div className={componentClassName}>
      {resize === false && (<Languages/>)}
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