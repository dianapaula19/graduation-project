import { ApiStatus } from "features/Utils";

interface IModalApiStatusProps {
  message: string;
  status: ApiStatus;
  additionalMessages?: string[];
}

export type {
  IModalApiStatusProps
}