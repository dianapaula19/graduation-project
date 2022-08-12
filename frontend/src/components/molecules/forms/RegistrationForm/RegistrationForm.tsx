import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import Button from "../../../atoms/Button/Button";
import InputField from "../../../atoms/InputField/InputField";
import { InputFieldType } from "../../../atoms/InputField/InputField.types";
import { regexRules } from "../Utils";
import { IRegistrationFormData } from "./RegistrationForm.types";
import LogoSvg from "../../../../assets/logo.svg";
import "./RegistrationForm.scss";
import { useDispatch } from "react-redux";
import { registerAsync } from "../../../../features/auth/registerSlice";

const RegistrationForm = () => {

  const { t } = useTranslation('forms');

  const dispatch = useDispatch();

  const [data, setData] = useState<IRegistrationFormData>({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const componentClassName = "registration-form";
  const inputFieldsTranslate = "registration.inputFields";
  const submitButtonsTranslate = "registration.buttons";
  const alreadyAnUserTranslate = "registration.alreadyAnUser";

  const validation = {
    email: !regexRules.email.test(data.email),
    password: !regexRules.password.test(data.password),
    confirmPassword: !(data.password === data.confirmPassword)
  }

  console.log(validation.email)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const name = e.target.name;
    const value = e.target.value;
    setData({
      ...data,
      [name]: value
    });
  }

  const onSubmit = (): void => {
    dispatch(registerAsync({
      email: data.email,
      password: data.password
    }));
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
        id={"registration-form-email"}
        placeholder={t(`${inputFieldsTranslate}.email.placeholder`)} 
        errorMessage={t(`${inputFieldsTranslate}.email.errorMessage`)}
        label={t(`${inputFieldsTranslate}.email.label`)}
        error={validation.email}
        onChange={handleChange}      
      />
      <InputField 
        type={InputFieldType.password}
        name={"password"}
        id={"registration-form-password"}
        placeholder={t(`${inputFieldsTranslate}.password.placeholder`)} 
        errorMessage={t(`${inputFieldsTranslate}.password.errorMessage`)}
        label={t(`${inputFieldsTranslate}.password.label`)}
        error={validation.password}
        onChange={handleChange}         
      />
      <InputField 
        type={InputFieldType.password}
        name={"confirmPassword"}
        id={"registration-form-confirm-password"}
        placeholder={t(`${inputFieldsTranslate}.confirmPassword.placeholder`)} 
        errorMessage={t(`${inputFieldsTranslate}.confirmPassword.errorMessage`)}
        label={t(`${inputFieldsTranslate}.confirmPassword.label`)}
        error={validation.confirmPassword}
        onChange={handleChange}         
      />
      <Button 
        label={t(`${submitButtonsTranslate}.signUp`)} 
        disabled={validation.confirmPassword || validation.password || validation.email}
        onClick={onSubmit}
      />
      <p className={`${componentClassName}__p`}>
        {t(`${alreadyAnUserTranslate}.text`)}
        <a
          href="/login" 
          className={`${componentClassName}__a`}
        >
          {t(`${alreadyAnUserTranslate}.link`)}
        </a>
      </p>
    </div>
  )
}

export default RegistrationForm;