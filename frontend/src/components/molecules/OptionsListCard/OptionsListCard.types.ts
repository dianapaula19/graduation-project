import { Degree, Domain, LearningMode, StudyProgram } from "../../App";

interface IOptionalsListCardProps {
  title: string;
  year: number;
  semester: number;
  domain: Domain;
  degree: Degree;
  learningMode: LearningMode;
  studyProgram: StudyProgram;
}

export type {
  IOptionalsListCardProps
}