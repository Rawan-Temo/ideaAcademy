export interface CreateUserDTO {
  username: string;
  password: string;
}

export interface UserResponse {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface UpdateUserDTO {
  username?: string;
  password?: string;
}
export interface UserLoginDTO {
  username: string;
  password: string;
}
