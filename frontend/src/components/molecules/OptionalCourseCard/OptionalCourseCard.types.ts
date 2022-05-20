import { HtmlHTMLAttributes } from "react";

interface IOptionalCourseCardProps extends HtmlHTMLAttributes<HTMLDivElement>{
    index: number;
    groupId: string;
    handleDragStart: (e: React.DragEvent<HTMLDivElement>, position: number, groupId: string) => void;
    handleDragEnter: (e: React.DragEvent<HTMLDivElement>, position: number, groupId: string) => void;
    optionalName: string;
    teacherName: string;
    teacherEmail: string;
    linkDocument?: string;
}

export type {
    IOptionalCourseCardProps
}