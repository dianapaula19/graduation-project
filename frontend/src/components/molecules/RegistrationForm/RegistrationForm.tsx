import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import Button from "../../atoms/Button/Button";
import InputField from "../../atoms/InputField/InputField";
import { InputFieldType } from "../../atoms/InputField/InputField.types";
import { regexRules } from "./utils";
import { IRegistrationFormData } from "./RegistrationForm.types";
import LogoSvg from "../../../assets/logo.svg";
import "./RegistrationForm.scss";

const RegistrationForm = () => {

    const [data, setData] = useState<IRegistrationFormData>({
        email: "",
        password: "",
        confirmPassword: ""
    });

    const componentClassName = "registration-form";

    const { t } = useTranslation();

    const validation = {
        email: !regexRules.email.test(data.email),
        password: !regexRules.password.test(data.password),
        confirmPassword: !(data.password === data.confirmPassword)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const name = e.target.name;
        const value = e.target.value;
        setData({
            ...data,
            [name]: value
        });
    }

    const onSubmit = (): void => {
        console.log(data);
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
                placeholder={t("registration.form.email.placeholder")} 
                errorMessage={t("registration.form.email.errorMessage")}
                label={t("registration.form.email.label")}
                required={true}
                error={validation.email}
                onChange={handleChange}            
            />
            <InputField 
                type={InputFieldType.password}
                name={"password"}
                id={"registration-form-password"}
                placeholder={t("registration.form.password.placeholder")} 
                errorMessage={t("registration.form.password.errorMessage")}
                label={t("registration.form.password.label")}
                required={true}
                error={validation.password}
                onChange={handleChange}               
            />
            <InputField 
                type={InputFieldType.password}
                name={"confirmPassword"}
                id={"registration-form-confirm-password"}
                placeholder={t("registration.form.confirmPassword.placeholder")} 
                errorMessage={t("registration.form.confirmPassword.errorMessage")}
                label={t("registration.form.confirmPassword.label")}
                required={true}
                error={validation.confirmPassword}
                onChange={handleChange}               
            />
            <Button 
                label={t("registration.form.button.label")} 
                disabled={validation.confirmPassword && validation.password && validation.email}
                onClick={onSubmit}
            />
            <p className={`${componentClassName}__p`}>
                {t("registration.form.alreadyAnUser")}
                <a
                    href="/login" 
                    className={`${componentClassName}__a`}
                >
                    {t("registration.form.alreadyAnUserLink")}
                </a>
            </p>
        </div>
    )
}

export default RegistrationForm;