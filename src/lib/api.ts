import axiosInstance from './axiosInstance';

interface User {
  id: string;
  email: string;
  username: string;
  profileUrl?: string;
  isVerified: boolean;
  oauthProvider?: string;
}

interface UserResponse {
  user: User;
}

export async function getUserDetails(): Promise<UserResponse> {
  const response = await axiosInstance.get('/auth/user');
  return response.data;
}
