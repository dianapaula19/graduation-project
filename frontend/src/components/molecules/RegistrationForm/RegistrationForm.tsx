import React, { useState } from "react";
import Button from "../../atoms/Button/Button";
import InputField from "../../atoms/InputField/InputField";
import { InputFieldType } from "../../atoms/InputField/InputField.types";
import { translations } from "./translations";
import LogoImg  from "../../../images/logo.jpg";
import RegisterImg from "./register-image.jpg";
import "./RegistrationForm.scss";
import { regexRules } from "./utils";
import { RegistrationFormData } from "./RegistrationForm.types";

const RegistrationForm = () => {

    const [data, setData] = useState<RegistrationFormData>({
        email: "",
        password: "",
        confirmPassword: ""
    });

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
        <div className="registration">
            <div className="registration__image">
                <img 
                    src={RegisterImg}
                    className="registration__image__img"
                />
            </div>
            <div className="registration__form">
                <img 
                    src={LogoImg}
                    className="registration__form__img"
                />
                <InputField 
                    type={InputFieldType.Email} 
                    name={"email"} 
                    id={"registration-form-email"}  
                    required={true} 
                    error={validation.email}  
                    onChange={handleChange} 
                    {...translations.ro.email}
                />
                <InputField 
                    type={InputFieldType.Password} 
                    name={"password"} 
                    id={"registration-form-password"}  
                    required={true} 
                    error={validation.password}  
                    onChange={handleChange} 
                    {...translations.ro.password}
                />
                <InputField 
                    type={InputFieldType.Password} 
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
                <p className="login__form__p">
                    {translations.ro.alreadyAnUser}
                    <a className="login__form__a">
                        {translations.ro.alreadyAnUserLink}
                    </a>
                </p>
            </div>
        </div>
    )
}

export default RegistrationForm;