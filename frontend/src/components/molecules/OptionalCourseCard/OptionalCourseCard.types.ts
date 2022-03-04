import { HtmlHTMLAttributes } from "react";

interface IOptionalCourseCardProps extends HtmlHTMLAttributes<HTMLDivElement>{
    optionalName: string;
    teacherName: string;
    teacherEmail: string;
    linkDocument: string;
}

export type {
    IOptionalCourseCardProps
}