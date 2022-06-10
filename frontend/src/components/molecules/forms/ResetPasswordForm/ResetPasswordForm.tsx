import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import Button from "../../../atoms/Button/Button";
import InputField from "../../../atoms/InputField/InputField";
import { InputFieldType } from "../../../atoms/InputField/InputField.types";
import { regexRules } from "../utils";
import { IResetPasswordFormData } from "./ResetPasswordForm.types";
import LogoSvg from "../../../../assets/logo.svg";
import "./ResetPasswordForm.scss";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../../../app/hooks";
import { resetPasswordAsync } from "../../../../features/auth/resetPasswordSlice";

const ResetPasswordForm = () => {

    const [data, setData] = useState<IResetPasswordFormData>({
        password: "",
        confirmPassword: ""
    });

    const componentClassName = "reset-password-form";
    const componentId = "reset-password-form";

    const inputFieldsTranslate = "forms.resetPassword.inputFields";
    const submitButtonsTranslate = "forms.resetPassword.submitButtons";

    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const queryParams = new URLSearchParams(window.location.search)
    const token = queryParams.get("token")

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
        console.log(token);
        if (token) {
            dispatch(resetPasswordAsync({
                token: token,
                password: data.password
            }))
        }
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
                id={`${componentId}-password`}
                placeholder={t(`${inputFieldsTranslate}.password.placeholder`)} 
                errorMessage={t(`${inputFieldsTranslate}.password.errorMessage`)}
                label={t(`${inputFieldsTranslate}.password.label`)}
                error={validation.password}
                onChange={handleChange}               
            />
            <InputField 
                type={InputFieldType.password}
                name={"confirmPassword"}
                id={`${componentId}-confirm-password`}
                placeholder={t(`${inputFieldsTranslate}.confirmPassword.placeholder`)} 
                errorMessage={t(`${inputFieldsTranslate}.confirmPassword.errorMessage`)}
                label={t(`${inputFieldsTranslate}.confirmPassword.label`)}
                error={validation.confirmPassword}
                onChange={handleChange}               
            />
            <Button 
                label={t(`${submitButtonsTranslate}.resetPassword`)} 
                disabled={validation.confirmPassword || validation.password}
                onClick={onSubmit}
            />
        </div>
    )
}

export default ResetPasswordForm;