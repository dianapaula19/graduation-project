import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import Button from "../../../atoms/Button/Button";
import InputField from "../../../atoms/InputField/InputField";
import { InputFieldType } from "../../../atoms/InputField/InputField.types";
import { regexRules } from "../utils";
import { IRecoverAccountFormData } from "./RecoverAccountForm.types";
import LogoSvg from "../../../../assets/logo.svg";
import "./RecoverAccountForm.scss";

const RecoverAccountForm = () => {

    const [data, setData] = useState<IRecoverAccountFormData>({
        email: "",
    });

    const componentClassName = "recover-account-form";

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
                {t("recoverAccount.form.instructions")}
            </p>
            <InputField 
                type={InputFieldType.email}
                name={"email"}
                id={"registration-form-email"}
                placeholder={t("recoverAccount.form.email.placeholder")} 
                errorMessage={t("recoverAccount.form.email.errorMessage")}
                label={t("recoverAccount.form.email.label")}
                required={false}
                error={false}
                onChange={handleChange}            
            />
            <Button 
                label={t("recoverAccount.form.button.label")} 
                disabled={false}
                onClick={onSubmit}
            />
        </div>
    )
}

export default RecoverAccountForm;