import React, { useState } from "react";
import Button from "../../atoms/Button/Button";
import InputField from "../../atoms/InputField/InputField";
import { InputFieldType } from "../../atoms/InputField/InputField.types";
import { translations } from "./translations";
import LogoImg  from "../../../images/logo.jpg";
import LoginImg from "./login-image.jpg";
import "./LoginForm.scss";

const LoginForm = () => {

    const [data, setData] = useState({
        email: "",
        password: ""
    });

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
        <div className="login">
            <div className="login__image">
                <img 
                    src={LoginImg}
                    className="login__image__img"
                />
            </div>
            <div className="login__form">
                <img 
                    src={LogoImg}
                    className="login__form__img"
                />
                <InputField 
                    type={InputFieldType.Email} 
                    name={"email"} 
                    id={"login-form-email"}  
                    required={true} 
                    error={false}  
                    onChange={handleChange} 
                    {...translations.ro.email}
                />
                <InputField 
                    type={InputFieldType.Password} 
                    name={"password"} 
                    id={"login-form-password"}  
                    required={true} 
                    error={false}  
                    onChange={handleChange} 
                    {...translations.ro.password}
                />
                <a className="login__form__a">
                    {translations.ro.forgotPassword}
                </a>
                <Button 
                    label={translations.ro.button.label} 
                    disabled={false}
                    onClick={onSubmit}
                />
                <p className="login__form__p">
                    {translations.ro.newUser}
                    <a className="login__form__a">
                        {translations.ro.newUserLink}
                    </a>
                </p>
            </div>
        </div>
    )
}

export default LoginForm;