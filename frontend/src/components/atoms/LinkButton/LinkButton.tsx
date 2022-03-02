import React from "react";
import { ILinkButtonProps } from "./LinkButton.types";
import "./LinkButton.scss";

const LinkButton = ({
    text,
    ...rest
}: ILinkButtonProps) => {

    const componentClassName = "link-button";

    return(
        <a
            className={componentClassName}
            {...rest}
        >
            {text}
        </a>
    )
}

export default LinkButton;