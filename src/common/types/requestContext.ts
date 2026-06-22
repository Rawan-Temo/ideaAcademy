import { Request } from "express";
import { UserResponse } from "../../modules/users/user.types";
import { User } from "../../generated/prisma/client";

export interface AuthRequestContext<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any,
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: Omit<User, "password">;
}
