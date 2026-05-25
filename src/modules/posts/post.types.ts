import { QueryParams } from "../../common/types/apiResponse";
import { DateTimeFilter } from "../../generated/prisma/commonInputTypes";

export interface CreatePostDTO {
  title: string;
  image?: string;
  video?: string;
  content: string;
}

export interface PostResponse {
  id: string;
  title: string;
  image: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostQueryDto extends QueryParams {
  id: string;
  title: string;
  image: string;
  content: string;
  createdAt: Date | DateTimeFilter;
  updatedAt: Date | DateTimeFilter;
}
export interface UpdatePostDTO {
  title?: string;
  image?: string;
  content?: string;
}
