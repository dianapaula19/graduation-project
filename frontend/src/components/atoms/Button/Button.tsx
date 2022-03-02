import classNames from "classnames";
import React from "react";
import { IButtonProps } from "./Button.types";
import "./Button.scss"

const Button = ({
    label,
    disabled,
    onClick,
    modifier
}
:IButtonProps
) => {
    const componentClassName = "button";
    const componentClassNames = classNames(
        componentClassName,
        modifier && `${componentClassName}--${modifier}`
    )
    return(
        <button 
            className={componentClassNames}
            disabled={disabled}
            onClick={onClick}
        >
            {label}
        </button>
    );
}

export default Button;