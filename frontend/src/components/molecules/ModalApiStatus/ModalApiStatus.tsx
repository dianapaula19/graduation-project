import React from "react";
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IModalApiStatusProps } from "./ModalApiStatus.types";
import "./ModalApiStatus.scss";


const ModalApiStatus = ({
  message,
  additionalMessages,
  error
}: IModalApiStatusProps) => {

  const componentClassName = "modal-api-status";
  const iconClassName = `${componentClassName}__icon`

  return (
    <div
      className={componentClassName}
    >
      {
        error === false ? 
        <FontAwesomeIcon
          className={`${iconClassName}`} 
          icon={faCircleCheck} 
        /> : 
        <FontAwesomeIcon
          className={`${iconClassName} ${iconClassName}--error`}
          icon={faCircleXmark} 
        />
      }
      <p
        className={`${componentClassName}__text`}
      >
        {error === false ? message + " :D" : message + " :("}
      </p>
      <div>
        {additionalMessages && additionalMessages.map((additionalMessage) => {
          return <div>
            {additionalMessage}
          </div>
        })}
      </div>
    </div>
  )
}

export default ModalApiStatus;