import { Response } from "express";
import { Prisma } from "../../generated/prisma/client";

export const handleError = (error: any, res: Response) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const field = (error.meta?.target as string[])?.[0] ?? "field";

    switch (error.code) {
      // Unique constraint violation
      case "P2002":
        res.status(400).json({
          message: `${field} is already taken`,
          detail: process.env.NODE_ENV === "production" ? null : error.meta,
        });
        return;

      // Foreign key constraint violation
      case "P2003":
        res.status(400).json({
          message: "Referenced record does not exist",
          detail: process.env.NODE_ENV === "production" ? null : error.meta,
        });
        return;

      // Record not found (e.g. update/delete on non-existent row)
      case "P2001":
      case "P2025":
        res.status(404).json({
          message: "Record not found",
        });
        return;

      // Null constraint violation
      case "P2011":
        res.status(400).json({
          message: `Field '${field}' cannot be null`,
        });
        return;

      // Value too long for column
      case "P2000":
        res.status(400).json({
          message: `Value too long for field '${field}'`,
        });
        return;

      // Required relation record not found
      case "P2015":
        res.status(404).json({
          message: "Related record not found",
        });
        return;

      // Invalid value for column type
      case "P2023":
        res.status(400).json({
          message: "Invalid input format",
          detail: process.env.NODE_ENV === "production" ? null : error.meta,
        });
        return;
    }
  }

  // ------------------------------------------------
  // Prisma validation errors (schema mismatch — dev bug)
  // ------------------------------------------------
  if (error instanceof Prisma.PrismaClientValidationError) {
    console.error("Prisma validation error:", error.message);
    res.status(400).json({ message: "Invalid request data" });
    return;
  }

  // ------------------------------------------------
  // Prisma connection errors
  // ------------------------------------------------
  if (error instanceof Prisma.PrismaClientInitializationError) {
    console.error("Prisma init error:", error.message);
    res.status(500).json({ message: "Service temporarily unavailable" });
    return;
  }
  // ------------------------------------------------
  // JWT errors
  // ------------------------------------------------
  if (error.name === "JsonWebTokenError") {
    res.status(401).json({ message: "Invalid token" });
    return;
  }

  if (error.name === "TokenExpiredError") {
    res.status(401).json({ message: "Token expired" });
    return;
  }

  if (error.name === "NotBeforeError") {
    res.status(401).json({ message: "Token not yet valid" });
    return;
  }

  // ------------------------------------------------
  // Fallback
  // ------------------------------------------------
  res.status(500).json({ message: "Internal server error" });
};
