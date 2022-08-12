import { SelectHTMLAttributes } from "react";

enum DropDownModifier {
  error = "error",
  teacherList = "teacher-list"
}

enum DropDownOptionsValue {
  placeholder = "placeholder"
}

interface Option {
  label: string;
  value: string;
}

interface IDropDownProps extends SelectHTMLAttributes<HTMLSelectElement>{
  modifier?: DropDownModifier;
  error: boolean;
  errorMessage?: string;
  label: string;
}

export type {
  IDropDownProps
}

export {
  DropDownModifier,
  DropDownOptionsValue
}