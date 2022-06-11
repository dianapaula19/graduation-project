import { AnchorHTMLAttributes } from "react";

enum LinkButtonModifier {
  syllabus = "syllabus"
}

interface ILinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement>{
  text: string;
  href: string;
  modifier?: LinkButtonModifier
}

export type {
  ILinkButtonProps
}

export {
  LinkButtonModifier
}