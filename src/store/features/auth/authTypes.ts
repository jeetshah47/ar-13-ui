export interface AuthState {
  loading: boolean;
  error: string;
  api: {
    token: string;
    uid: string;
  };
  common: {
    isLogin: boolean;
  };
}
