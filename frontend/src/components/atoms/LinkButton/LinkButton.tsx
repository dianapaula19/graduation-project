import React from "react";
import { ILinkButtonProps, LinkButtonModifier } from "./LinkButton.types";
import "./LinkButton.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

const LinkButton = ({
  text,
  modifier,
  ...rest
}: ILinkButtonProps) => {

  const componentClassName = "link-button";

  const componentClassNames = classNames(
    componentClassName,
    modifier && `${componentClassName}--${modifier}`
  )

  let icon = null;
  switch (modifier) {
    case LinkButtonModifier.syllabus:
      icon = <FontAwesomeIcon icon={faFilePdf} /> 
      break;
    default:
      break;
  }

  return(
    <a
      className={componentClassNames}
      {...rest}
    >   
      {modifier && (
        icon       
      )}
      {text}
    </a>
  )
}

export default LinkButton;