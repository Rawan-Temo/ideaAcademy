import jwt from "jsonwebtoken";
import { User } from "../../generated/prisma/client";
import { Response } from "express";

export function generateAccToken(user: User): string {
  return jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: "4h",
  });
}
export function generateRefToken(user: User): string {
  return jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
  });
}
export function setCookie(res: Response, refreshToken: string): void {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}
