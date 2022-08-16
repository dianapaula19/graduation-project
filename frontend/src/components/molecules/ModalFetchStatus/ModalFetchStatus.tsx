import { faFaceDizzy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "components/atoms/Loader";
import { ApiStatus } from "features/Utils";
import { IModalFetchStatusProps } from "./ModalFetchStatus.types";
import "./ModalFetchStatus.scss";


const FetchStatus = ({
  message,
  status
}: IModalFetchStatusProps) => {
  
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