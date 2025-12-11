import { UserDelegate } from "../../generated/prisma/models";

export interface CreateUserDTO {
  username: string;
  password: string;
}

export interface UserResponse extends UserDelegate {
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
