export interface GetAllResponse<T> {
  status: string;
  data: T[];
  results: number;
  total: number;
}
