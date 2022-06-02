import { InputHTMLAttributes } from "react";

enum CheckBoxModifier {
  course = "course"
}

interface CheckBoxProps extends InputHTMLAttributes<HTMLInputElement>{
  modifier?: CheckBoxModifier;
  label: string;
}

export type {
  CheckBoxProps
}