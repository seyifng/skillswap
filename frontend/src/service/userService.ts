import { api } from "./api";

export interface User {
  id: number;
  name: string;
  bio: string;
  completedTasks: number; // corrected property name to match backend
}

export interface UpdateUserRequest {
  name: string;
  bio: string;
}

// Corrected paths
export const getUserById = (userId: number): Promise<User> =>
  api<User>(`/skillswap/user/${userId}`);

export const updateUser = (
  userId: number,
  data: UpdateUserRequest,
): Promise<User> =>
  api<User>(`/skillswap/user/${userId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const getAllUsers = (): Promise<User[]> =>
  api<User[]>(`/skillswap/user`);
