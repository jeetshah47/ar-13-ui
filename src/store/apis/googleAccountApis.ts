import { http } from "../../config/http";
import type {
  LinkGoogleAccountRequest,
  LinkGoogleAccountResponse,
  UnlinkGoogleAccountResponse,
  GoogleAccountStatusResponse,
  GetAllLinkedAccountsResponse,
} from "../types/GoogleAccount/GoogleAccountTypes";

const BASE_URL = "http://localhost:3000/api/google-account";

export interface InitiateOAuthResponse {
  authUrl: string;
  message: string;
}

export async function initiateGoogleOAuth(): Promise<InitiateOAuthResponse> {
  const url = `${BASE_URL}/auth/initiate`;
  const result = await http.get<InitiateOAuthResponse>(url);
  return result.data;
}

export async function linkGoogleAccount(
  googleIdToken: string
): Promise<LinkGoogleAccountResponse> {
  const url = `${BASE_URL}/link`;
  const result = await http.post<LinkGoogleAccountResponse>(
    url,
    { googleIdToken } as LinkGoogleAccountRequest
  );
  return result.data;
}

export async function unlinkGoogleAccount(): Promise<UnlinkGoogleAccountResponse> {
  const url = `${BASE_URL}/unlink`;
  const result = await http.post<UnlinkGoogleAccountResponse>(url);
  return result.data;
}

export async function getGoogleAccountStatus(): Promise<GoogleAccountStatusResponse> {
  const url = `${BASE_URL}/status`;
  const result = await http.get<GoogleAccountStatusResponse>(url);
  return result.data;
}

export async function getAllLinkedAccounts(): Promise<GetAllLinkedAccountsResponse> {
  const url = `${BASE_URL}/all`;
  const result = await http.get<GetAllLinkedAccountsResponse>(url);
  return result.data;
}

