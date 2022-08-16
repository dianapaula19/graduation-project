import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "./Modal.scss";
import { IModalProps } from "./Modal.types";

const Modal = ({
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
        <FontAwesomeIcon 
          icon={faXmark}
          className={`${headerClassName}__icon`}
          onClick={closeModal}
        />
        </div>
        <div
          className={`${contentClassName}__children`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;