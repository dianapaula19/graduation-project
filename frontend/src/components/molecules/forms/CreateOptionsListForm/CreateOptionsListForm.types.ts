import { Degree, Domain, LearningMode, StudyProgram } from "../../../App";

interface Course {
  id: number;
  title: string;
}

enum CreateOptionsListFormType {
  create = "create",
  update = "update",
}

interface ICreateOptionsListFormProps {
  title?: string;
  year?: string;
  semester?: string;
  domain?: string;
  learningMode?: string;
  degree?: string;
  studyProgram?: string;
  coursesIds?: number[];
  courses: Course[];
  type?: CreateOptionsListFormType
}

interface ICreateOptionsListFormData {
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
  ICreateOptionsListFormProps,
  ICreateOptionsListFormData
}

export {
  CreateOptionsListFormType
}