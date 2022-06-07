import { Role } from "../../../App";

interface Account {
  email: string;
  role: Role;
  verified: boolean;
}

interface IAccountsListProps {
  title: string;
  accounts: Account[];
}

export type {
  Account,
  IAccountsListProps
}