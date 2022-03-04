import classNames from "classnames";
import React from "react";
import { ButtonModifier, IButtonProps } from "./Button.types";
import "./Button.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";

const Button = ({
    label,
    disabled,
    modifier
}
:IButtonProps
) => {
    const componentClassName = "button";
    const componentClassNames = classNames(
        componentClassName,
        modifier && `${componentClassName}--${modifier}`
    )
    
    let icon = null;
    switch (modifier) {
        case ButtonModifier.save:
            icon = <FontAwesomeIcon icon={faFloppyDisk} /> 
            break;
        case ButtonModifier.excel:
            icon = <FontAwesomeIcon icon={faFileExcel} />
            break;
        default:
            break;
    }

    return(
        <button 
            className={componentClassNames}
            disabled={disabled}
        >   
            {modifier && (
                icon           
            )}
            <span
                className={`${componentClassName}__span`}
            >
                {label}    
            </span>
        </button>
    );
}

export default Button;