import { Role } from "../../../App";

interface IUserData {
  firstName: string;
  lastName: string;
  role: string;
}

interface IGrade {
  year: string; 
  grade: string;
}

interface IStudentData {
  domain: string;
  learningMode: string;
  degree: string;
  studyProgram: string;
  currentYear: string;
  currentGroup: string;
  grades: IGrade[];
}

interface ITeacherData {
  coursesId: number[];
}

interface IUserDataFormProps {
  role: Role;
  email: string;
}

export type {
  IUserDataFormProps
}
