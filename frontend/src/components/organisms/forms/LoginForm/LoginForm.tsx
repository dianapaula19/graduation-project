import Button from "components/atoms/Button";
import InputField, { InputFieldType } from "components/atoms/InputField";
import { loginAsync, ILoginRequest } from "features/account/loginSlice";
import LogoSVG from "assets/logo.svg";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import "./LoginForm.scss";
import { ILoginFormData } from "./LoginForm.types";

const LoginForm = () => {

  const { t } = useTranslation('forms');
  
  const dispatch = useDispatch();

  const componentClassName = "login-form";
  const inputFieldsTranslate = "login.inputFields";

  const [data, setData] = useState<ILoginFormData>({
    email: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const name = e.target.name;
    const value = e.target.value;
    setData({
      ...data,
      [name]: value
    });
  }

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter") {
      onSubmit();
    }

  }
  
  const onSubmit = (): void => {
    dispatch(loginAsync(data as ILoginRequest));
  }

  return(
    <div className={componentClassName}>
      <img
        className={`${componentClassName}__img`}
        src={LogoSVG}
        alt={t("common:img.logo")}
      />
      <InputField 
        type={InputFieldType.email}
        name={"email"}
        id={"login-form-email"}
        placeholder={t(`${inputFieldsTranslate}.email.placeholder`)} 
        label={t(`${inputFieldsTranslate}.email.label`)}
        required={true}
        error={false}
        onChange={handleChange}         
      />
      <InputField 
        type={InputFieldType.password} 
        name={"password"} 
        id={"login-form-password"}
        placeholder={t(`${inputFieldsTranslate}.password.placeholder`)} 
        label={t(`${inputFieldsTranslate}.password.label`)}  
        required={true} 
        error={false}  
        onChange={handleChange} 
        onKeyPress={handleKeyPress}
      />
      <a 
        className={`${componentClassName}__a`}
        href="/recoverAccount"
      >
        {t("login.forgotPassword")}
      </a>
      <Button 
        label={t("login.buttons.signIn")} 
        disabled={false}
        onClick={onSubmit}
      />
      <p className={`${componentClassName}__p`}>
        {t("login.newUser.text")}
        <a
          href="/register" 
          className={`${componentClassName}__a`}>
          {t("login.newUser.link")}
        </a>
      </p>
    </div>
  )
}

export default LoginForm;