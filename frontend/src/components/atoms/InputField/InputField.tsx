import React, { useState } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faEnvelope, faUser, faEye, faEyeSlash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { InputFieldProps, InputFieldType } from "./InputField.types";
import "./InputField.scss";

const InputField = ({
    type,
    name,
    id,
    placeholder,
    label,
    required,
    error,
    errorMessage,
    modifier,
    onChange
}
: InputFieldProps
) => {
    
    const mainClassName = "input-field";
    const inputGroupClassName = `${mainClassName}__input-group`;
    const errorGroupClassName = `${mainClassName}--error__error-group`;

    const mainClassNames = classNames(
        mainClassName,
        modifier && `${mainClassName}--${modifier}`
    );

    const inputGroupClassNames = classNames(
        inputGroupClassName,
        modifier && `${inputGroupClassName}--${modifier}`    
    );
    
    const [showPassword, setShowPassword] = useState(false);
    
    const iconSwitch = (type: InputFieldType): JSX.Element => {
        switch (type) {
            case 'email':
                return <FontAwesomeIcon 
                            icon={faEnvelope} 
                            className={`${inputGroupClassName}__icon`}
                        />
            case 'password':
                return <FontAwesomeIcon 
                            icon={faLock} 
                            className={`${inputGroupClassName}__icon`}
                        />
            default:
                return <FontAwesomeIcon 
                            icon={faUser} 
                            className={`${inputGroupClassName}__icon`}
                        />
        }
    }

    const passwordIconSwitch = (showPassword: boolean): JSX.Element => {
        switch (showPassword) {
            case true:
                return <FontAwesomeIcon 
                            icon={faEye} 
                            className={classNames(
                                `${inputGroupClassName}__icon`,
                                `${inputGroupClassName}__icon--password`
                            )}
                            onClick={() => setShowPassword(!showPassword)}
                        />
            case false:
                return <FontAwesomeIcon 
                            icon={faEyeSlash} 
                            className={classNames(
                                `${inputGroupClassName}__icon`,
                                `${inputGroupClassName}__icon--password`
                            )}
                            onClick={() => setShowPassword(!showPassword)}
                        />
        }
    }

    const switchType = (type: InputFieldType): InputFieldType => {
        switch (type) {
            case InputFieldType.Email:
                return InputFieldType.Email
            case InputFieldType.Password:
                return showPassword ? InputFieldType.Text : InputFieldType.Password
            default:
                return InputFieldType.Text
        }
    }

    return(
        <div className={mainClassNames}>
            <label 
                htmlFor={id}
                className={`${mainClassName}__label`}
            >
                {label}
            </label>
            <div className={inputGroupClassNames}>
                {iconSwitch(type)}
                <input 
                    type={switchType(type)}
                    id={id}
                    name={name}
                    required={required}
                    placeholder={placeholder}
                    onChange={onChange}
                    className={classNames(
                        `${inputGroupClassName}__input`
                    )}
                />
                {
                    type === InputFieldType.Password && (passwordIconSwitch(showPassword))
                }    
            </div>
            {error && (
                <div className={errorGroupClassName}>
                    <FontAwesomeIcon 
                        icon={faXmark} 
                        className={`${errorGroupClassName}__icon`}
                    />
                    <span className={`${errorGroupClassName}__span`}>
                        {errorMessage}
                    </span>
                </div>
            ) }
        </div>
    )
}

export default InputField;