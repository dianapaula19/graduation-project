import { HtmlHTMLAttributes } from "react";

interface IOptionalCourseCardProps extends HtmlHTMLAttributes<HTMLDivElement>{
    optionalName: string;
    teacherName: string;
    teacherEmail: string;
    linkDocument?: string;
    draggableProps: {
        key: number | string;
        draggableId: string;
        index: number;
    }
}

export type {
    IOptionalCourseCardProps
}