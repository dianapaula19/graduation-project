import { faFaceDizzy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { ApiStatus } from "../../../features/Utils";
import Loader from "../../atoms/Loader";
import "./FetchStatus.scss";
import { IFetchStatusProps } from "./FetchStatus.types";

const FetchStatus = ({
  message,
  status
}: IFetchStatusProps) => {
  
  const componentClassName = "fetch-status";
  
  return (
    <div
      className={componentClassName}
    >
      {status === ApiStatus.loading && (
        <Loader />
      )}
      {status === ApiStatus.failed && (
        <>
          <FontAwesomeIcon 
            style={{
              "fontSize": "xx-large"
            }}
            icon={faFaceDizzy} 
          />
          <p
            style={{
              "fontSize": "x-large"
            }}
          >
            {message}
          </p>
        </>
      )}
    </div>
  )
}

export default FetchStatus;