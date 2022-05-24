import { Role } from "../../../App";

interface Account {
  email: string;
  role: Role;
  verified: boolean;
}

interface IAccountsListProps {
  accounts: Account[]
}

export type {
  Account,
  IAccountsListProps
}