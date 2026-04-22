import { DateTimeFilter } from "../../generated/prisma/commonInputTypes";

export interface GetAllResponse<T> {
  status: string;
  data: T[];
  results: number;
  total: number;
}
export interface CreatedResponse<T> {
  status: string;
  data: T;
  message?: string;
}
export interface GetOneResponse<T> {
  status: string;
  data: T;
  message?: string;
}

// TODO seprate filtering, sorting, pagination params
export interface QueryParams extends Record<string, any> {
  page?: number;
  limit?: number;
  sort?: string;
  fields?: string;
  search?: string;
}
