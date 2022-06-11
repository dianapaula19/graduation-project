import { HtmlHTMLAttributes } from "react";

interface IOptionalCourseCardProps extends HtmlHTMLAttributes<HTMLDivElement>{
  index: number;
  optionalCourseId: number;
  optionalsListId: number;
  handleDragStart: (position: number, optionalsListId: number) => void;
  handleDragEnter: (position: number, optionalsListId: number) => void;
  optionalName: string;
  teacherName: string;
  teacherEmail: string;
  linkDocument?: string;
}

export type {
  IOptionalCourseCardProps
}