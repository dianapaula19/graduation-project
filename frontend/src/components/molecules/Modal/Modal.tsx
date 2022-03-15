import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { IModalProps } from "./Modal.types";
import "./Modal.scss";

const Modal = ({
    title,
    setIsOpen,
    children
}: IModalProps) => {

    const componentClassName = "modal";
    const headerClassName = `${componentClassName}__header`;
    const iconClassName = `${headerClassName}__icon`;

    return (
        <div 
            className={componentClassName}
        >
            <div 
                className={headerClassName}
            >
                <span
                    className={`${headerClassName}__title`}
                >
                    {title}
                </span>
                <FontAwesomeIcon 
                    icon={faXmark}
                    className={`${headerClassName}__icon`}
                    onClick={() => setIsOpen(false)}
                />
            </div>
            {children}
        </div>
    );
}

export default Modal;