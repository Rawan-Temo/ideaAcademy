import { Response } from "express";
import { Prisma } from "../../generated/prisma/client";
import { ZodError } from "zod";

// ------------------------------------------------
// Helpers for parsing Prisma error.meta shapes,
// which differ across Postgres / MySQL / SQLite
// ------------------------------------------------

/**
 * Pulls a column name out of a constraint/index name following the
 * common <table>_<column>_key naming convention (default for MySQL/SQLite,
 * and what Prisma generates unless you've named indexes yourself).
 */
const fieldFromConstraintName = (name: string): string => {
  const match = name.match(/^[A-Za-z0-9]+_(.+?)_key$/);
  return match ? match[1] : name;
};

/**
 * Extracts the offending column/field name from a Prisma error's meta.
 * Meta shape varies depending on connector AND whether a driver adapter is used:
 * - Postgres/SQLite (default connector): meta.target is string[] -> ["email"]
 * - MySQL (default connector): meta.target is a string constraint name -> "User_email_key"
 * - Driver adapters (e.g. @prisma/adapter-*): the real error is nested under
 *   meta.driverAdapterError.cause, with the constraint name at
 *   meta.driverAdapterError.cause.constraint.index (or .fields, depending on driver)
 */
const getConstraintField = (meta: Record<string, any> | undefined): string => {
  const target = meta?.target;

  if (Array.isArray(target)) {
    return target[0] ?? "field";
  }

  if (typeof target === "string") {
    return fieldFromConstraintName(target);
  }

  // Driver adapter shape: dig into the nested cause for a constraint name
  const cause = meta?.driverAdapterError?.cause;
  const constraintName: unknown =
    cause?.constraint?.index ??
    cause?.constraint?.fields?.[0] ??
    cause?.constraint;

  if (typeof constraintName === "string") {
    return fieldFromConstraintName(constraintName);
  }
  if (Array.isArray(constraintName)) {
    return constraintName[0] ?? "field";
  }

  // Last resort: try to parse the column out of the raw driver error message,
  // e.g. "Duplicate entry '21334522123' for key 'Course_title_key'"
  const rawMessage: unknown = cause?.originalMessage;
  if (typeof rawMessage === "string") {
    const keyMatch = rawMessage.match(/for key '([^']+)'/);
    if (keyMatch) return fieldFromConstraintName(keyMatch[1]);
  }

  return "field";
};

/**
 * Extracts a human-friendly relation/field name from a P2003 (foreign key)
 * error's meta.field_name, which often looks like "Post_authorId_fkey (index)".
 */
const getRelationField = (fieldName: unknown): string => {
  if (typeof fieldName === "string") {
    return fieldName.split(" ")[0];
  }
  return "relation";
};

/**
 * Formats a ZodError into a flatter, more readable shape:
 * - `message`: a single human-readable summary (first error found)
 * - `fields`: { fieldName: ["error1", "error2"] } for field-specific issues
 * - `formErrors`: top-level errors not tied to a specific field
 *   (e.g. unrecognized keys, refinements on the whole object)
 */
const formatZodError = (error: ZodError) => {
  const flattened = error.flatten();
  const fields = flattened.fieldErrors as Record<string, string[] | undefined>;
  const formErrors = flattened.formErrors;

  // Build a single readable summary message: prefer the first field error,
  // fall back to the first form-level error
  const firstFieldEntry = Object.entries(fields).find(
    ([, msgs]) => msgs && msgs.length > 0,
  );
  const summary = firstFieldEntry
    ? `${firstFieldEntry[0]}: ${firstFieldEntry[1]![0]}`
    : (formErrors[0] ?? "Invalid request data");

  return {
    message: summary,
    fields,
    formErrors,
  };
};

export const handleError = (error: any, res: Response) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      // Unique constraint violation
      case "P2002": {
        const field = getConstraintField(error.meta);
        res.status(400).json({
          message: `${field} is already taken`,
          detail: process.env.NODE_ENV === "production" ? null : error.meta,
        });
        return;
      }

      // Foreign key constraint violation
      case "P2003": {
        const fkField = getRelationField(error.meta?.field_name);
        res.status(400).json({
          message: `Referenced ${fkField} does not exist`,
          detail: process.env.NODE_ENV === "production" ? null : error.meta,
        });
        return;
      }

      // Record not found (e.g. update/delete on non-existent row)
      case "P2001":
      case "P2025":
        res.status(404).json({
          message: "Record not found",
        });
        return;

      // Null constraint violation
      case "P2011": {
        const field = getConstraintField(error.meta);
        res.status(400).json({
          message: `Field '${field}' cannot be null`,
        });
        return;
      }

      // Value too long for column
      case "P2000": {
        const field = getConstraintField(error.meta);
        res.status(400).json({
          message: `Value too long for field '${field}'`,
        });
        return;
      }

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
  // zod validation errors (schema mismatch — dev bug)
  // ------------------------------------------------
  if (error instanceof ZodError) {
    const { message, fields, formErrors } = formatZodError(error);
    res.status(400).json({
      message,
      errors: { fieldErrors: fields, formErrors },
    });
    return;
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
