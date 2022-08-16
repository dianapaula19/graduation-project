import { IOptionalCourseCardProps } from "../OptionsCourseCard/OptionsCourseCard.types";

interface IOptionalCourseCard {
  courseId: number;
  courseTitle: string;
  teacherName: string;
  teacherEmail: string;
  linkDocument?: string;
}

interface IDataRef {
  position: number;
  id: number;
}

interface IOptionalCoursesContainerProps {
  optionalsListId: number;
  title: string;
  courses: IOptionalCourseCard[];
}

export type {
  IOptionalCourseCard,
  IDataRef,
  IOptionalCoursesContainerProps
}