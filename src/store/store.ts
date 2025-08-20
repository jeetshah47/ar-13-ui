import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./features/auth/authSlice";
import { useDispatch, type TypedUseSelectorHook } from "react-redux";
import { useSelector } from "react-redux";
import { projectListReducer } from "./features/projects/projectSlice";

export const store = configureStore({
  reducer: { authReducer, projectListReducer },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
