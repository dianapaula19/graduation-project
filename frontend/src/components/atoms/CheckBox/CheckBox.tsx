import React, { useEffect } from "react";
import { CheckBoxProps } from "./CheckBox.types";
import "./CheckBox.scss";

const CheckBox = ({
  label,
  id,
  ...rest
}: CheckBoxProps
) => {

  const componentClassName = "checkbox";
  

  return (
    <div
      className={componentClassName}
    >
      <input 
        className={`${componentClassName}__input`}
        type="checkbox"
        {...rest}
      />
      <label
        className={`${componentClassName}__label`} 
        htmlFor={id}
      >
          {label}
      </label>
    </div>
  )
}

export default CheckBox;