import { IOptionalCourseCardProps } from "../OptionalCourseCard/OptionalCourseCard.types";

interface IOptionalCoursesContainerProps {
    groupId: string;
    groupTitle: string;
    optionalCourses: IOptionalCourseCardProps[];
}

export type {
    IOptionalCoursesContainerProps
}