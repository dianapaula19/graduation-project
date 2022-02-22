import classNames from "classnames";
import React from "react";
import { ButtonProps } from "./Button.types";
import "./Button.scss"

const Button = ({
    label,
    disabled,
    modifier
}
:ButtonProps
) => {
    const mainClass = "button";
    const mainClassNames = classNames(
        mainClass,
        modifier && `${mainClass}--${modifier}`
    )
    return(
        <button 
            className={mainClassNames}
            disabled={disabled}
        >
            {label}
        </button>
    );
}

export default Button;