import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import Button from "../../../atoms/Button/Button";
import InputField from "../../../atoms/InputField/InputField";
import { InputFieldType } from "../../../atoms/InputField/InputField.types";
import { ILoginFormData } from "./LoginForm.types";
import LogoSvg from "../../../../assets/logo.svg";
import "./LoginForm.scss";
import { useDispatch } from "react-redux";
import { ILoginRequest, loginAsync, loginStatus } from "../../../../features/auth/loginSlice";
import { useAppSelector } from "../../../../app/hooks";
import { ApiStatus } from "../../../../features/Utils";
import { useNavigate } from "react-router-dom";

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
  
  const onSubmit = (): void => {
    dispatch(loginAsync(data as ILoginRequest));
  }

  return(
    <div className={componentClassName}>
      <img
        className={`${componentClassName}__img`}
        src={LogoSvg}
      />
      <InputField 
        type={InputFieldType.email}
        name={"email"}
        id={"login-form-email"}
        placeholder={t(`${inputFieldsTranslate}.email.placeholder`)} 
        errorMessage={t(`${inputFieldsTranslate}.email.errorMessage`)} 
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
        errorMessage={t(`${inputFieldsTranslate}.password.errorMessage`)} 
        label={t(`${inputFieldsTranslate}.password.label`)}  
        required={true} 
        error={false}  
        onChange={handleChange} 
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