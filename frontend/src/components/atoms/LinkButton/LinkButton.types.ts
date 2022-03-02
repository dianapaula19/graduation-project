import { AnchorHTMLAttributes } from "react";

interface ILinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement>{
    text: string;
    href: string;
}

export type {
    ILinkButtonProps
}