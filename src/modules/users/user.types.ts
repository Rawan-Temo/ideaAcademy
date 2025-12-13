import { QueryParams } from "../../common/types/apiResponse";
import { DateTimeFilter } from "../../generated/prisma/commonInputTypes";
// TODO seprate each DTOs into own files and class

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

export interface UserQueryDto extends QueryParams {
  id: string;
  username: string;
  createdAt: Date | DateTimeFilter;
  updatedAt: Date | DateTimeFilter;
}
export interface UpdateUserDTO {
  username?: string;
  password?: string;
}
export interface UserLoginDTO {
  username: string;
  password: string;
}
