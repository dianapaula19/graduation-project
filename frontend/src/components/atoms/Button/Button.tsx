import classNames from "classnames";
import React from "react";
import { ButtonProps } from "./Button.types";
import "./Button.scss"

const Button = ({
    label,
    disabled,
    onClick,
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
            onClick={onClick}
        >
            {label}
        </button>
    );
}

export default Button;