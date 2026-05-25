import { request, type Request, type Response } from "express";
import { UserService } from "./user.service";
import { User } from "../../generated/prisma/browser";
import { GetAllResponse } from "../../common/types/apiResponse";

import bcrypt from "bcrypt";
import { UserLoginDTO, UserQueryDto, UserResponse } from "./user.types";
import jwt from "jsonwebtoken";
import {
  generateAccToken,
  generateRefToken,
  setCookie,
} from "../../common/helpers/generateAccRefToken";
import {
  sendAll,
  sendBadRequest,
  sendCreated,
  sendInternalServerError,
  sendNotFound,
  sendOne,
  sendUnauthorized,
} from "../../common/utils/response";
const getAllUsers = async <T extends UserQueryDto>(
  req: Request<any, any, any, T>,
  res: Response,
) => {
  try {
    console.log("hi");
    const { rows, count } = await UserService.getAllUsers(req.query);

    sendAll(res, rows, 200, count);
  } catch (err) {
    console.error(err);
    sendInternalServerError(res, "Internal server error");
  }
};

const createUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await hashingPassword(password);
    const user = await UserService.createUser({
      username,
      password: hashedPassword,
    });
    sendCreated(res, user);
  } catch (error) {
    console.error(error);
    sendInternalServerError(res, "Internal server error");
  }
};
const getOneUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await UserService.getUserById(id);
    if (!user) {
      return sendNotFound(res, "User not found");
    }
    sendOne(res, user);
  } catch (error) {
    console.error(error);
    sendInternalServerError(res, "Internal server error");
  }
};
const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (req.body.password) {
      req.body.password = await hashingPassword(req.body.password);
    }
    const data = req.body;
    const user = await UserService.updateUser(data, id);
    sendOne(res, user);
  } catch (error) {
    console.error(error);
    sendInternalServerError(res, "Internal server error");
  }
};
const deleteManyUsers = async (req: Request, res: Response) => {
  try {
    const ids = req.body.ids;
    const user = await UserService.deleteManyUsers(ids);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    sendInternalServerError(res, "Internal server error");
  }
};
export async function hashingPassword(password: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}
const login = async (
  req: Request<any, any, UserLoginDTO, any>,
  res: Response,
) => {
  try {
    let { username, password } = req.body;
    const user = await UserService.findByUsername(username);
    if (!user) {
      return sendBadRequest(res, "Invalid Username or Password");
    }

    let isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendBadRequest(res, "Invalid Username or Password");
    }
    let accessToken = generateAccToken(user);
    let refreshToken = generateRefToken(user);
    await UserService.saveRefreshToken(user.id, refreshToken);
    setCookie(res, refreshToken);

    res.status(200).json({
      accessToken,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    console.log(error);
    sendInternalServerError(res, "Internal server error");
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      sendUnauthorized(res, "No refresh token provided");
      return;
    }

    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
      userId: string;
    };

    const user = await UserService.getUserById(payload.userId);
    if (!user || user.refreshToken !== token) {
      sendUnauthorized(res, "Invalid refresh token");
      return;
    }

    const newAccessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: "15m" },
    );
    const newRefreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" },
    );

    // fix 3: invalidate old token before saving new one
    await UserService.saveRefreshToken(user.id, newRefreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    sendInternalServerError(res, "Internal server error");
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;
    console.log("Logging out user with token:", token);
    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
          userId: string;
        };
        await UserService.saveRefreshToken(payload.userId, null);
      } catch {
        // token invalid or expired — still proceed with logout
      }
    }
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    sendInternalServerError(res, "Internal server error");
  }
};

const userProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    // Exclude refresh token from response
    user.refreshToken = undefined;
    return sendOne(res, user);
  } catch (error) {
    console.error(error);
    sendInternalServerError(res, "Internal server error");
  }
};

export {
  login,
  getAllUsers,
  createUser,
  getOneUser,
  updateUser,
  deleteManyUsers,
  logout,
  refreshToken,
  userProfile,
};
