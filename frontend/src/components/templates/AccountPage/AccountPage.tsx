import LoginSVG from "assets/login.svg";
import RegistrationSVG from "assets/registration.svg";
import RecoverAccountSVG from "assets/recover-account.svg";
import ResetPasswordSVG from "assets/reset-password.svg";
import "./AccountPage.scss";
import { useWindowDimensions } from "app/hooks";
import LanguageSwitch from "components/atoms/LanguageSwitch";
import LoginForm from "components/organisms/forms/LoginForm";
import RecoverAccountForm from "components/organisms/forms/RecoverAccountForm";
import RegistrationForm from "components/organisms/forms/RegistrationForm/RegistrationForm";
import ResetPasswordForm from "components/organisms/forms/ResetPasswordForm";
import { useState, useEffect } from "react";
import { IAuthentificationPageProps, AccountAction } from "./AccountPage.types";
import { t } from "i18next";

const AuthentificationPage = ({
  action
}
: IAuthentificationPageProps) => {

  const componentClassName = "authentification-template";
  const mainClassName = `${componentClassName}__main`;
  const imageClassName = `${mainClassName}__image-container`;
  const formClassName = `${mainClassName}__form-container`;

  const { width } = useWindowDimensions();

  const [resize, setResize] = useState(false);

  let form = null;
  let image = null;

  switch (action) {
    case AccountAction.registration:
      form = <RegistrationForm />;
      image = RegistrationSVG;
      break;
    case AccountAction.login:
      form = <LoginForm />;
      image = LoginSVG;
      break;
    case AccountAction.recoverAccount:
      form = <RecoverAccountForm />;
      image = RecoverAccountSVG;
      break;
    case AccountAction.resetPassword:
      form = <ResetPasswordForm />;
      image = ResetPasswordSVG;
      break;
  }

  useEffect(() => {
    if (width < 750) {
      setResize(true);
    } else {
      setResize(false);
    }

  }, [
    width, 
    setResize
  ]);
  
  return(
    <div className={componentClassName}>
      {resize === false && (<LanguageSwitch/>)}
      <div className={mainClassName}>
        <div className={imageClassName}>
          <img
            src={image}
            alt={t(`common:img.${AccountAction}`)}
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