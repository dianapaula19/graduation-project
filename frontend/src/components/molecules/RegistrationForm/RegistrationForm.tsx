import React, { useState } from "react";
import Button from "../../atoms/Button/Button";
import InputField from "../../atoms/InputField/InputField";
import { InputFieldType } from "../../atoms/InputField/InputField.types";
import { translations } from "./translations";
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
                required={true} 
                error={validation.email}  
                onChange={handleChange} 
                {...translations.ro.email}
            />
            <InputField 
                type={InputFieldType.password} 
                name={"password"} 
                id={"registration-form-password"}  
                required={true} 
                error={validation.password}  
                onChange={handleChange} 
                {...translations.ro.password}
            />
            <InputField 
                type={InputFieldType.password} 
                name={"confirmPassword"} 
                id={"registration-form-confirm-password"}  
                required={true} 
                error={validation.confirmPassword}  
                onChange={handleChange} 
                {...translations.ro.confirmPassword}
            />
            <Button 
                label={translations.ro.button.label} 
                disabled={validation.confirmPassword && validation.password && validation.email}
                onClick={onSubmit}
            />
            <p className={`${componentClassName}__p`}>
                {translations.ro.alreadyAnUser}
                <a className={`${componentClassName}__a`}>
                    {translations.ro.alreadyAnUserLink}
                </a>
            </p>
        </div>
    )
}

export default RegistrationForm;