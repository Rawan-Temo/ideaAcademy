import { DateTimeFilter } from "../../generated/prisma/commonInputTypes";

export interface GetAllResponse<T> {
  status: string;
  data: T[];
  results: number;
  total: number;
}

// TODO seprate filtering, sorting, pagination params
export interface QueryParams extends Record<string, any> {
  page?: number;
  limit?: number;
  sort?: string;
  fields?: string;
  search?: string;
}
