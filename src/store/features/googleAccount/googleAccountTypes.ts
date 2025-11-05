import type { IUserAccountLink } from "../../types/GoogleAccount/GoogleAccountTypes";

export interface GoogleAccountState {
  link: IUserAccountLink | null;
  linked: boolean;
  loading: boolean;
  error: string | null;
  linking: boolean;
  unlinking: boolean;
}

