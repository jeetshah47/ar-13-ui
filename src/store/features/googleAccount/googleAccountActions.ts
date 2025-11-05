import type { AppDispatch } from "../../store";
import {
  linkGoogleAccount,
  unlinkGoogleAccount,
  getGoogleAccountStatus,
  initiateGoogleOAuth,
} from "../../apis/googleAccountApis";
import {
  getGoogleAccountStatusRequest,
  getGoogleAccountStatusSuccess,
  getGoogleAccountStatusFailed,
  linkGoogleAccountRequest,
  linkGoogleAccountSuccess,
  linkGoogleAccountFailed,
  unlinkGoogleAccountRequest,
  unlinkGoogleAccountSuccess,
  unlinkGoogleAccountFailed,
} from "./googleAccountSlice";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

export const getGoogleAccountStatusAction =
  () => async (dispatch: AppDispatch) => {
    dispatch(getGoogleAccountStatusRequest());
    try {
      const response = await getGoogleAccountStatus();
      dispatch(
        getGoogleAccountStatusSuccess({
          linked: response.linked,
          link: response.link,
        })
      );
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message ||
        "Failed to get Google account status";
      dispatch(getGoogleAccountStatusFailed(message));
    }
  };

export const linkGoogleAccountAction =
  (googleIdToken: string) => async (dispatch: AppDispatch) => {
    dispatch(linkGoogleAccountRequest());
    try {
      const response = await linkGoogleAccount(googleIdToken);
      dispatch(linkGoogleAccountSuccess(response.link));
      toast.success("Google account linked successfully");
      // Refresh status to ensure consistency
      dispatch(getGoogleAccountStatusAction());
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message ||
        "Failed to link Google account";
      dispatch(linkGoogleAccountFailed(message));
      toast.error(message);
    }
  };

export const initiateGoogleOAuthAction =
  () => async (dispatch: AppDispatch) => {
    dispatch(linkGoogleAccountRequest());
    try {
      const response = await initiateGoogleOAuth();
      // Redirect to Google OAuth page
      window.location.href = response.authUrl;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message ||
        "Failed to initiate Google OAuth";
      dispatch(linkGoogleAccountFailed(message));
      toast.error(message);
    }
  };

export const unlinkGoogleAccountAction =
  () => async (dispatch: AppDispatch) => {
    dispatch(unlinkGoogleAccountRequest());
    try {
      await unlinkGoogleAccount();
      dispatch(unlinkGoogleAccountSuccess());
      toast.success("Google account unlinked successfully");
      // Refresh status to ensure consistency
      dispatch(getGoogleAccountStatusAction());
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message ||
        "Failed to unlink Google account";
      dispatch(unlinkGoogleAccountFailed(message));
      toast.error(message);
    }
  };

