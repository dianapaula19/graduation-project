import React, { useState } from "react";
import Button from "../../atoms/Button/Button";
import InputField from "../../atoms/InputField/InputField";
import { InputFieldType } from "../../atoms/InputField/InputField.types";
import { translations } from "./translations";
import { ILoginFormData } from "./LoginForm.types";
import LogoSvg from "../../../assets/logo.svg";
import "./LoginForm.scss";

const LoginForm = () => {

    const [data, setData] = useState<ILoginFormData>({
        email: "",
        password: ""
    });

    const componentClassName = "login-form";

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
                id={"login-form-email"}  
                required={true} 
                error={false}  
                onChange={handleChange} 
                {...translations.ro.email}
            />
            <InputField 
                type={InputFieldType.password} 
                name={"password"} 
                id={"login-form-password"}  
                required={true} 
                error={false}  
                onChange={handleChange} 
                {...translations.ro.password}
            />
            <a className={`${componentClassName}__a`}>
                {translations.ro.forgotPassword}
            </a>
            <Button 
                label={translations.ro.button.label} 
                disabled={false}
                onClick={onSubmit}
            />
            <p className={`${componentClassName}__p`}>
                {translations.ro.newUser}
                <a className={`${componentClassName}__a`}>
                    {translations.ro.newUserLink}
                </a>
            </p>
        </div>
    )
}

export default LoginForm;