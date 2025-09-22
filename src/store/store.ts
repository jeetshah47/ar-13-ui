import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./features/auth/authSlice";
import { useDispatch, type TypedUseSelectorHook } from "react-redux";
import { useSelector } from "react-redux";
import { projectListReducer } from "./features/projects/projectSlice";
import { projectDetailReducer } from "./features/projects/projectDetailSlice";
import { taskListReducer } from "./features/task/taskSlice";
import { timeTrackingReducer } from "./features/task/timeTrackingSlice";
import { dashboardReducer } from "./features/dashboard/dashboardSlice";
import { userReducer } from "./features/user/userSlice";
import { calendarReducer } from "./features/calendar/calendarSlice";
import { vacationReducer } from "./features/vacation/vacationSlice";
import { employeeReducer } from "./features/employees/employeeSlice";

export const store = configureStore({
  reducer: {
    authReducer,
    projectListReducer,
    projectDetailReducer,
    taskListReducer,
    timeTrackingReducer,
    dashboardReducer,
    userReducer,
    calendarReducer,
    vacationReducer,
    employeeReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
