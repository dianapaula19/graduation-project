import React, { useEffect } from "react";
import { CheckBoxProps } from "./CheckBox.types";
import "./CheckBox.scss";

const CheckBox = ({
  id,
  label
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
        id={id} 
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