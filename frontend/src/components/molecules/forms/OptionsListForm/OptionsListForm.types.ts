import { Degree, Domain, LearningMode, StudyProgram } from "../../../App";

interface Course {
  id: number;
  title: string;
}

enum OptionsListFormType {
  create = "create",
  update = "update",
}

interface IOptionsListFormProps {
  title?: string;
  year?: string;
  semester?: string;
  domain?: string;
  learningMode?: string;
  degree?: string;
  studyProgram?: string;
  coursesIds?: number[];
  courses: Course[];
  type?: OptionsListFormType
}

interface IOptionsListFormData {
  title: string;
  year: number;
  semester: number;
  domain: Domain;
  learningMode: LearningMode;
  degree: Degree;
  studyProgram: StudyProgram;
  coursesIds: number[];
}

export type {
  IOptionsListFormProps,
  IOptionsListFormData
}

export {
  OptionsListFormType
}