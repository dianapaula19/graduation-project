import React from "react";
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IModalApiStatusProps } from "./ModalApiStatus.types";
import "./ModalApiStatus.scss";
import { ApiStatus } from "features/Utils";
import Loader from "components/atoms/Loader";


const ModalApiStatus = ({
  message,
  additionalMessages,
  status
}: IModalApiStatusProps) => {

  const componentClassName = "modal-api-status";
  const iconClassName = `${componentClassName}__icon`

  if (status === ApiStatus.loading) {
    return (
      <div
        className={componentClassName}
      >
        <Loader />
      </div>  
    )
  }

  return (
    <div
      className={componentClassName}
    >
      {
        status === ApiStatus.success && (
          <FontAwesomeIcon
            className={`${iconClassName}`} 
            icon={faCircleCheck} 
          />  
        ) 
      }
      {
        status === ApiStatus.failed && (
          <FontAwesomeIcon
            className={`${iconClassName} ${iconClassName}--error`}
            icon={faCircleXmark} 
          />  
        )
      }
      
      <p
        className={`${componentClassName}__text`}
      >
        {status === ApiStatus.success && message + " :D"}
        {status === ApiStatus.failed && message + " :("}
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