import type { AppDispatch } from "../../store";
import {
  getUsersFailed,
  getUsersRequest,
  getUsersSuccess,
} from "../user/userSlice";
import { getAllUsers } from "../../apis/userApis";
import type { AxiosError } from "axios";
import type { UserErrorResponse } from "../../types/User/UserErrorResponse";
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
