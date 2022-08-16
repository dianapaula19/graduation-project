import { Role } from "../../../App";

interface IAccountsPageProps {
  role: Role
}

type StudentsFiltersDictionary = {
  [key: string]: string[] | StudentsFiltersDictionary;
};

export type {
  IAccountsPageProps,
  StudentsFiltersDictionary
}