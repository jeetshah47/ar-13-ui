export interface UserResponse {
  name: string;
  email: string;
  role: string;
  password: string;
  designation: string;
  created: Created;
  id: string;
}

interface Created {
  _seconds: number;
  _nanoseconds: number;
}
