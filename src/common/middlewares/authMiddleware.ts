import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../generated/prisma/client";
import { UserService } from "../../modules/users/user.service";
import {
  sendForbidden,
  sendInternalServerError,
  sendUnauthorized,
} from "../utils/response";

export const authenticateToken = async (
  req: Request<any, any, any, any>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token || token === "null") {
      sendUnauthorized(res, "No token provided");
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string,
    ) as { userId: string };

    const foundUser = await UserService.getUserById(decoded.userId);
    if (!foundUser) {
      sendUnauthorized(res, "Invalid token");
      return;
    }
    req.user = foundUser;
    next();
  } catch (error) {
    console.error(error);
    sendUnauthorized(res, "Invalid token error");
  }
};

export const allowedTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const currentUser = req.user;

    if (!currentUser) {
      sendForbidden(res, "Forbidden");

      return;
    }

    if (!roles.includes(currentUser.role)) {
      sendForbidden(res, "Forbidden");
      return;
    }

    next();
  };
};
