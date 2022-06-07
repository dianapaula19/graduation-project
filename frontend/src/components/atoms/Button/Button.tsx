import classNames from "classnames";
import React from "react";
import { ButtonModifier, IButtonProps } from "./Button.types";
import "./Button.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFloppyDisk, faEnvelope, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const Button = ({
    label,
    disabled,
    modifier,
    ...rest
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
        case ButtonModifier.mail:
            icon = <FontAwesomeIcon icon={faEnvelope} />
            break;
        case ButtonModifier.delete:
            icon = <FontAwesomeIcon icon={faTrashCan} />
            break;
        default:
            break;
    }

    return(
        <button 
            className={componentClassNames}
            disabled={disabled}
            {...rest}
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