import { Response } from "express";
import {
  CreatedResponse,
  GetAllResponse,
  GetOneResponse,
} from "../types/apiResponse";

export function sendAll<T>(
  res: Response,
  data: [T],
  statusCode: number = 200,
  total: number,
): void {
  const response: GetAllResponse<T> = {
    status: "success",
    data,
    results: data.length,
    total,
  };
  res.status(statusCode).json(response);
}

export function sendCreated<T>(
  res: Response,
  data: T,
  message: string = "item Create Successfully",
): void {
  const response: CreatedResponse<T> = {
    status: "success",
    data,
    message,
  };
  res.status(201).json(response);
}
export function sendOne<T>(res: Response, data: T, message?: string): void {
  const response: GetOneResponse<T> = {
    status: "success",
    data,
    message,
  };
  res.status(200).json(response);
}

export function sendNoContent(res: Response): void {
  res.status(204).send();
}
export function sendNotFound(res: Response, messsage?: string): void {
  res.status(404).json({
    status: "error",
    message: messsage || "Resource not found",
  });
}
export function sendBadRequest(res: Response, messsage?: string): void {
  res.status(400).json({
    status: "error",
    message: messsage,
  });
}
export function sendInternalServerError(
  res: Response,
  messsage?: string,
): void {
  res.status(500).json({
    status: "error",
    message: messsage || "Internal server error",
  });
}
export function sendUnauthorized(res: Response, messsage?: string): void {
  res.status(401).json({
    status: "error",
    message: messsage || "Unauthorized",
  });
}
export function sendForbidden(res: Response, messsage?: string): void {
  res.status(403).json({
    status: "error",
    message: messsage || "Forbidden",
  });
}
