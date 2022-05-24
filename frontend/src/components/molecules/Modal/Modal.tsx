import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { IModalProps } from "./Modal.types";
import "./Modal.scss";

const Modal = ({
    title,
    show,
    closeModal,
    children
}: IModalProps) => {

    const componentClassName = "modal";
    const contentClassName = `${componentClassName}__content`;
    const headerClassName = `${contentClassName}__header`;

    if (show === false) {
        return null;
    }

    return (
        <div 
            className={componentClassName}
        >
            <div
                className={contentClassName}
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
                    onClick={closeModal}
                />
                </div>
            {children}

            </div>
        </div>
    );
}

export default Modal;