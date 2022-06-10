import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import Button from "../../../atoms/Button/Button";
import InputField from "../../../atoms/InputField/InputField";
import { InputFieldType } from "../../../atoms/InputField/InputField.types";
import { regexRules } from "../utils";
import { IRecoverAccountFormData } from "./RecoverAccountForm.types";
import LogoSvg from "../../../../assets/logo.svg";
import "./RecoverAccountForm.scss";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { recoverAccountAsync, recoverAccountShowModal } from "../../../../features/auth/recoverAccountSlice";

const RecoverAccountForm = () => {

    const [data, setData] = useState<IRecoverAccountFormData>({
        email: "",
    });

    const validation = {
        email: !regexRules.email.test(data.email)
    }

    const componentClassName = "recover-account-form";
    const componentId = "recover-account-form";

    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const inputFieldsTranslate = "forms.recoverAccount.inputFields";
    const submitButtonsTranslate = "forms.recoverAccount.submitButtons";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const name = e.target.name;
        const value = e.target.value;
        setData({
            ...data,
            [name]: value
        });
    }

    const onSubmit = (): void => {
        dispatch(recoverAccountAsync({
            email: data.email
        }));
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
                {t("recoverAccount.form.instructions")}
            </p>
            <InputField 
                type={InputFieldType.email}
                name={"email"}
                id={`${componentId}-email`}
                placeholder={t(`${inputFieldsTranslate}.email.placeholder`)} 
                errorMessage={t(`${inputFieldsTranslate}.email.errorMessage`)}
                label={t(`${inputFieldsTranslate}.email.label`)}
                error={validation.email}
                onChange={handleChange}            
            />
            <Button 
                label={t(`${submitButtonsTranslate}.sendInstructions`)} 
                disabled={validation.email}
                onClick={onSubmit}
            />
        </div>
    )
}

export default RecoverAccountForm;