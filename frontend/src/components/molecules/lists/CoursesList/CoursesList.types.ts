
interface ICourse {
  id: number;
  title: string;
  capacity: number;
  link: string;
  teacher_email: string;
  teacher_first_name: string;
  teacher_last_name: string;
}

interface ICoursesListProps {
  courses: ICourse[]; 
}

export type {
  ICoursesListProps
}