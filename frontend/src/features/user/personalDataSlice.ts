import { Degree, Domain, LearningMode, Role, StudyProgram } from "../../components/App";
import { ApiStatus } from "../Utils";

export interface ICategory {
  domain: Domain,
  learningMode: LearningMode,
  studyProgram: StudyProgram,
  degree: Degree
}

export interface IStudentData {
  currentGroup: string;
  currentYear: string;
  currentSemester: string;
  currentGrade: number;
  category: ICategory;
}

export interface IPersonalDataState {
  firstName: null | string;
  lastName: null | string;
  role: Role;
  studentData: null | IStudentData;
  status: ApiStatus;
}

export const initialState: IPersonalDataState = {
  firstName: null,
  lastName: null,
  role: Role.none,
  studentData: null,
  status: ApiStatus.idle
}

