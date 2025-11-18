import type { AppDispatch } from "../../store";
import {
  getUsersFailed,
  getUsersRequest,
  getUsersSuccess,
  getUserPermissionsRequest,
  getUserPermissionsSuccess,
  getUserPermissionsFailed,
  updateUserRequest,
  updateUserSuccess,
  updateUserFailed,
  deleteUserRequest,
  deleteUserSuccess,
  deleteUserFailed,
} from "../user/userSlice";
import {
  getAllUsers,
  getUserPermissions,
  updateUser,
  deleteUser,
} from "../../apis/userApis";
import type { AxiosError } from "axios";
import type { UserErrorResponse } from "../../types/User/UserErrorResponse";
import type { UpdateUserRequest } from "../../types/User/UpdateUserRequest";
import toast from "react-hot-toast";

export const getUsersAction = () => async (dispatch: AppDispatch) => {
  dispatch(getUsersRequest());
  try {
    getAllUsers()
      .then((data) => {
        dispatch(getUsersSuccess(data));
      })
      .catch((error: AxiosError<UserErrorResponse>) => {
        if (error?.response?.data) {
          dispatch(getUsersFailed(error?.response?.data));
        }
      });
  } catch {
    toast.error("Failed to get users");
    dispatch(getUsersFailed({ error: "Unkown Error" }));
  }
};

// Get user permissions action - uses GET /api/users/permissions/:id
export const getUserPermissionsAction = (userId: string) => async (dispatch: AppDispatch) => {
  dispatch(getUserPermissionsRequest());
  try {
    const data = await getUserPermissions(userId);
    dispatch(getUserPermissionsSuccess(data));
  } catch (error) {
    const axiosError = error as AxiosError<UserErrorResponse>;
    const errorMessage = axiosError?.response?.data?.error || "Failed to get user permissions";
    dispatch(getUserPermissionsFailed(errorMessage));
    toast.error(errorMessage);
  }
};

// Update user action - uses PUT /api/users/update
export const updateUserAction = (userData: UpdateUserRequest) => async (dispatch: AppDispatch) => {
  dispatch(updateUserRequest());
  try {
    await updateUser(userData);
    dispatch(updateUserSuccess());
    toast.success("User updated successfully");
    // Refresh the users list to reflect the changes
    dispatch(getUsersAction());
  } catch (error) {
    const axiosError = error as AxiosError<UserErrorResponse>;
    const errorMessage = axiosError?.response?.data?.error || "Failed to update user";
    dispatch(updateUserFailed(errorMessage));
    toast.error(errorMessage);
  }
};

export const deleteUserAction = (userId: string) => async (dispatch: AppDispatch) => {
  dispatch(deleteUserRequest());
  try {
    await deleteUser(userId);
    dispatch(deleteUserSuccess(userId));
    toast.success("User deleted successfully");
  } catch (error) {
    const axiosError = error as AxiosError<UserErrorResponse>;
    const errorMessage = axiosError?.response?.data?.error || "Failed to delete user";
    dispatch(deleteUserFailed(errorMessage));
    toast.error(errorMessage);
  }
};
