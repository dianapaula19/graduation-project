import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import Button from "../../../atoms/Button/Button";
import InputField from "../../../atoms/InputField/InputField";
import { InputFieldType } from "../../../atoms/InputField/InputField.types";
import { ILoginFormData } from "./LoginForm.types";
import LogoSvg from "../../../../assets/logo.svg";
import "./LoginForm.scss";
import { useDispatch } from "react-redux";
import { ILoginRequest, loginAsync } from "../../../../features/auth/loginSlice";

const LoginForm = () => {

    const dispatch = useDispatch();

    const [data, setData] = useState<ILoginFormData>({
        email: "",
        password: ""
    });

    const componentClassName = "login-form";

    const { t } = useTranslation();

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
                placeholder={t("login.form.email.placeholder")} 
                errorMessage={t("login.form.email.errorMessage")} 
                label={t("login.form.email.label")}
                required={true}
                error={false}
                onChange={handleChange}                 
            />
            <InputField 
                type={InputFieldType.password} 
                name={"password"} 
                id={"login-form-password"}
                placeholder={t("login.form.password.placeholder")} 
                errorMessage={t("login.form.password.errorMessage")} 
                label={t("login.form.password.label")}  
                required={true} 
                error={false}  
                onChange={handleChange} 
            />
            <a 
                className={`${componentClassName}__a`}
                href="/recoverAccount"
            >
                {t("login.form.forgotPassword")}
            </a>
            <Button 
                label={t("login.form.button.label")} 
                disabled={false}
                onClick={onSubmit}
            />
            <p className={`${componentClassName}__p`}>
                {t("login.form.newUser")}
                <a
                    href="/register" 
                    className={`${componentClassName}__a`}>
                    {t("login.form.newUserLink")}
                </a>
            </p>
        </div>
    )
}

export default LoginForm;