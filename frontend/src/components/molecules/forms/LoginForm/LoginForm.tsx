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

    const dispatch = useDispatch();
    const status = useAppSelector(loginStatus);
    let navigate = useNavigate();

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

    // useEffect(() => {
    //     if (status == ApiStatus.success) {
    //         navigate('/')
    //     }
    // }, [status])
    

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