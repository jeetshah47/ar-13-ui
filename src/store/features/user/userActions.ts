import type { AppDispatch } from "../../store";
import { getUserProfileById } from "../../apis/userApis";
import { getUserProfileFailed, getUserProfileRequest, getUserProfileSuccess } from "./userSlice";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

export const getUserProfileAction = (userId: string) => async (dispatch: AppDispatch) => {
  dispatch(getUserProfileRequest());
  try {
    const response = await getUserProfileById(userId);
    // Merge leaveRequests from top-level API response into user object
    const userWithLeaveRequests = {
      ...response.user,
      leaveRequests: response.leaveRequests || response.user.leaveRequests,
    };
    dispatch(getUserProfileSuccess(userWithLeaveRequests));
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message = axiosError.response?.data?.message || "Failed to load user profile";
    dispatch(getUserProfileFailed(message));
    toast.error(message);
  }
};


