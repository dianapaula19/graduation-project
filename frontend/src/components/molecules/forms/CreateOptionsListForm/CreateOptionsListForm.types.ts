import { Degree, Domain, LearningMode, StudyProgram } from "../../../App";

interface Course {
  id: number;
  title: string;
}

interface ICreateOptionsListFormProps {
  courses: Course[];
}

interface ICreateOptionsListFormData {
  title: string;
  year: number;
  semester: number;
  domain: Domain | string;
  learningMode: LearningMode | string;
  degree: Degree | string;
  studyProgram: StudyProgram | string;
  coursesIds: number[];
}

export type {
  ICreateOptionsListFormProps,
  ICreateOptionsListFormData
}