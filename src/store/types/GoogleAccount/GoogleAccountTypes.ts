export interface IUserAccountLink {
  id: string;
  userId: string;
  provider: "google" | "microsoft" | "github";
  providerUserId: string;
  providerEmail: string;
  providerDisplayName?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  isActive: boolean;
  linkedAt: Date;
  created: Date;
  updated?: Date;
}

export interface LinkGoogleAccountRequest {
  googleIdToken: string;
}

export interface LinkGoogleAccountResponse {
  message: string;
  link: IUserAccountLink;
}

export interface UnlinkGoogleAccountResponse {
  message: string;
}

export interface GoogleAccountStatusResponse {
  linked: boolean;
  link: IUserAccountLink | null;
}

export interface GetAllLinkedAccountsResponse {
  links: IUserAccountLink[];
}

