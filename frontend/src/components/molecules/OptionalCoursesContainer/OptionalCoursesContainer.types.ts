import { IOptionalCourseCardProps } from "../OptionalCourseCard/OptionalCourseCard.types";

interface IOptionalCourseCard {
    optionalName: string;
    teacherName: string;
    teacherEmail: string;
    linkDocument?: string;
}

interface IDataRef {
    position: number;
    groupId: string;
}

interface IOptionalCoursesContainerProps {
    groupId: string;
    groupTitle: string;
    optionalCourses: IOptionalCourseCard[];
}

export type {
    IOptionalCourseCard,
    IDataRef,
    IOptionalCoursesContainerProps
}