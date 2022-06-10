interface IOptionsList {
  title: string;
  year: number;
  semester: number;
  domain: string;
  degree: string;
  learning_mode: string;
  study_program: string;
}

interface IOptionsListCardProps {
  data: IOptionsList;
  onClick: () => void;
}

export type {
  IOptionsListCardProps
}