import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import Button from "../../../atoms/Button/Button";
import InputField from "../../../atoms/InputField/InputField";
import { InputFieldType } from "../../../atoms/InputField/InputField.types";
import { regexRules } from "../utils";
import { IResetPasswordFormData } from "./ResetPasswordForm.types";
import LogoSvg from "../../../../assets/logo.svg";
import "./ResetPasswordForm.scss";

const ResetPasswordForm = () => {

    const [data, setData] = useState<IResetPasswordFormData>({
        password: "",
        confirmPassword: ""
    });

    const componentClassName = "reset-password-form";

    const { t } = useTranslation();

    const validation = {
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
            <p
                className={`${componentClassName}__instructions`}
            >
                {t("resetPassword.form.instructions")}
            </p>
            <InputField 
                type={InputFieldType.password}
                name={"password"}
                id={"reset-password-form-password"}
                placeholder={t("resetPassword.form.password.placeholder")} 
                errorMessage={t("resetPassword.form.password.errorMessage")}
                label={t("resetPassword.form.password.label")}
                required={true}
                error={validation.password}
                onChange={handleChange}               
            />
            <InputField 
                type={InputFieldType.password}
                name={"confirmPassword"}
                id={"reset-password-form-confirm-password"}
                placeholder={t("resetPassword.form.confirmPassword.placeholder")} 
                errorMessage={t("resetPassword.form.confirmPassword.errorMessage")}
                label={t("resetPassword.form.confirmPassword.label")}
                required={true}
                error={validation.confirmPassword}
                onChange={handleChange}               
            />
            <Button 
                label={t("resetPassword.form.button.label")} 
                disabled={validation.confirmPassword && validation.password}
                onClick={onSubmit}
            />
        </div>
    )
}

export default ResetPasswordForm;