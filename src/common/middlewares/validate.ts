import { Request, Response, NextFunction } from "express";

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
