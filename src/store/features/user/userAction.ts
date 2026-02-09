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
import { handleActionError } from "../../../utils/errorUtils";

export const getUsersAction = () => async (dispatch: AppDispatch) => {
  dispatch(getUsersRequest());
  try {
    getAllUsers()
      .then((data) => {
        dispatch(getUsersSuccess(data));
      })
      .catch((error: AxiosError<UserErrorResponse>) => {
        const errorMessage = handleActionError(error, false);
        const axiosError = error as AxiosError<UserErrorResponse>;
        if (axiosError?.response?.data) {
          dispatch(getUsersFailed(axiosError.response.data));
        } else {
          dispatch(getUsersFailed({ error: errorMessage }));
        }
      });
  } catch (error) {
    const errorMessage = handleActionError(error);
    dispatch(getUsersFailed({ error: errorMessage }));
  }
};

// Get user permissions action - uses GET /api/users/permissions/:id
export const getUserPermissionsAction = (userId: string) => async (dispatch: AppDispatch) => {
  dispatch(getUserPermissionsRequest());
  try {
    const data = await getUserPermissions(userId);
    dispatch(getUserPermissionsSuccess(data));
  } catch (error) {
    const errorMessage = handleActionError(error);
    dispatch(getUserPermissionsFailed(errorMessage));
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
    const errorMessage = handleActionError(error);
    dispatch(updateUserFailed(errorMessage));
  }
};

export const deleteUserAction = (userId: string) => async (dispatch: AppDispatch) => {
  dispatch(deleteUserRequest());
  try {
    await deleteUser(userId);
    dispatch(deleteUserSuccess(userId));
    toast.success("User deleted successfully");
  } catch (error) {
    const errorMessage = handleActionError(error);
    dispatch(deleteUserFailed(errorMessage));
  }
};
