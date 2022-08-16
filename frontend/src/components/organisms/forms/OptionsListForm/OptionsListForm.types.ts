import { Degree, Domain, LearningMode, StudyProgram } from "../../../App";
interface IOptionsListFormProps {
  type: 'create' | 'update'
}

interface IOptionsListFormData {
  title: string;
  year: number;
  semester: number;
  domain: string;
  learningMode: string;
  degree: string;
  studyProgram: string;
  coursesIds: number[];
}

export type {
  IOptionsListFormProps,
  IOptionsListFormData
}