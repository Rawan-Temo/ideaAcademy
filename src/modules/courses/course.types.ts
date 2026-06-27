import { QueryParams } from "../../common/types/apiResponse";
import { DateTimeFilter } from "../../generated/prisma/commonInputTypes";
export interface CreateCourseDTO {
  title: string;
  image?: string;
  video?: string;
  content: string;
}

export interface CourseResponse {
  id: string;
  title: string;
  image: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseQueryDTO extends QueryParams {
  id: string;
  title: string;
  image: string;
  video: string;
  content: string;
  createdAt: Date | DateTimeFilter;
  updatedAt: Date | DateTimeFilter;
}
export interface UpdateCourseDTO {
  title?: string;
  image?: string;
  content?: string;
  video?: string;
}
