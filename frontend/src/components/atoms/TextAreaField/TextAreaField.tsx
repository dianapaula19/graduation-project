import React from "react";
import { TextAreaFieldProps } from "./TextAreaField.types";
import "./TextAreaField.scss";

const TextAreaField = ({
  id,
  label,
  ...rest
}: TextAreaFieldProps) => {
  
  const componentClassName = "textarea-field";

  return (
  <div
    className={componentClassName}
  >
    <label 
    htmlFor={id}
    className={`${componentClassName}__label`}
      >
    {label}
    </label>
    <textarea
    className={`${componentClassName}__textarea`}
    id={id}
    {...rest}
    >

    </textarea>
  </div>
  )
}

export default TextAreaField;