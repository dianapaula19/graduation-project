import React from "react";
import { CheckBoxProps } from "./CheckBox.types";
import "CheckBox.scss";

const CheckBox = ({
  id,
  label
}: CheckBoxProps
) => {
  return (
    <div>
      <input 
        type="checkbox" 
        id={id} 
      />
      <label 
        htmlFor={id}>
          {label}
      </label>
    </div>
  )
}

export default CheckBox;