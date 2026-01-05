import { Request, Response, NextFunction } from "express";
import { object } from "zod";
import { QueryParams } from "../types/apiResponse";

export const validate = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body); // throws if invalid
      next();
    } catch (err: any) {
      res.status(400).json({ message: err.errors || err.message });
    }
  };
};
// GO FIBER TypeScript javascript express DBS GORM SEQUELIZE PRISMA MONGOOSE Docker
// N Tier archetecture
// front end  archetecture

export function validateQuery<T extends QueryParams>(fieldschema: string[]) {
  return (
    req: Request<any, any, any, T>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const queryFields = req.query;
      console.log("Test");

      if (queryFields.sort) {
        const sortFields = queryFields.sort.split(",");
        if (!checkTwoMatchingArrays(sortFields, fieldschema)) {
          res.status(400).json({ message: `Invalid sort  query parameter` });
          return;
        }
      }
      if (queryFields.fields) {
        const fields = queryFields.fields.split(",");
        if (!checkTwoMatchingArrays(fields, fieldschema)) {
          res.status(400).json({ message: `Invalid fields  query parameter` });
          return;
        }
      }
      const filterFields = { ...queryFields };
      const excludedFields = [
        "page",
        "sort",
        "limit",
        "fields",
        "search",
      ] as const;
      excludedFields.forEach((el) => delete filterFields[el]);
      if (!checkTwoMatchingArrays(Object.keys(filterFields), fieldschema)) {
        res.status(400).json({ message: `Invalid filtering query parameter` });
        return;
      }
      next();
    } catch (err: any) {
      next();
      res.status(400).json({ message: err.errors || err.message });
    }
  };
}

const checkTwoMatchingArrays = (keys: string[], arr: string[]): boolean => {
  for (const key of keys) {
    if (!arr.includes(key)) {
      return false;
    }
  }
  return true;
};
