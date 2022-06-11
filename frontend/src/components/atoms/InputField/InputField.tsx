import React, { useState } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faEnvelope, faUser, faEye, faEyeSlash, faXmark, faFileArrowUp } from "@fortawesome/free-solid-svg-icons";
import { InputFieldModifier, InputFieldProps, InputFieldType } from "./InputField.types";
import "./InputField.scss";

const InputField = ({
  type,
  id,
  label,
  error,
  errorMessage,
  modifier,
  ...rest
}
: InputFieldProps
) => {
  
  const componentClassName = "input-field";
  const inputGroupClassName = `${componentClassName}__input-group`;
  const errorGroupClassName = `${componentClassName}--error__error-group`;
  const fileUploadClassName = "file-upload";

  const componentClassNames = classNames(
    componentClassName,
    modifier && `${componentClassName}--${modifier}`,
    error && `${componentClassName}--${InputFieldModifier.error}`
  );

  const inputGroupClassNames = classNames(
    inputGroupClassName,
    modifier && `${inputGroupClassName}--${modifier}`,
    error && `${inputGroupClassName}--${InputFieldModifier.error}`  
  );
  
  const [showPassword, setShowPassword] = useState(false);
  
  const iconSwitch = (type: InputFieldType): JSX.Element | null => {
    switch (type) {
      case InputFieldType.email:
        return <FontAwesomeIcon 
              icon={faEnvelope} 
              className={`${inputGroupClassName}__icon`}
            />
      case InputFieldType.password:
        return <FontAwesomeIcon 
              icon={faLock} 
              className={`${inputGroupClassName}__icon`}
            />
      case InputFieldType.file:
        return <FontAwesomeIcon 
              icon={faFileArrowUp} 
              className={`${inputGroupClassName}__icon`}
            />
      default:
        return null;
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
      case InputFieldType.email:
        return InputFieldType.email
      case InputFieldType.password:
        return showPassword ? InputFieldType.text : InputFieldType.password
      case InputFieldType.number:
        return InputFieldType.number
      case InputFieldType.file:
        return InputFieldType.file
      default:
        return InputFieldType.text
    }
  }

  if (type === InputFieldType.file) {
    return (
      <div
        className={fileUploadClassName}
      >
        {iconSwitch(InputFieldType.file)}
        <label 
          htmlFor={id} 
        >
          {label}
        </label>
        <input 
          id={id} 
          type={InputFieldType.file}
        />
      </div>
    )
  }

  return(
    <div className={componentClassNames}>
      <label 
        htmlFor={id}
        className={`${componentClassName}__label`}
      >
        {label}
      </label>
      <div className={inputGroupClassNames}>
        {iconSwitch(type)}
        <input 
          type={switchType(type)}
          id={id}
          className={classNames(
            `${inputGroupClassName}__input`
          )}
          {...rest}
        />
        {
          type === InputFieldType.password && (passwordIconSwitch(showPassword))
        }  
      </div>
      { error && (
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