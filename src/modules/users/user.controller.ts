import type { Request, Response } from "express";
import { UserService } from "./user.service";
import { User } from "../../generated/prisma/browser";
import { GetAllResponse } from "../../common/types/apiResponse";

import bcrypt from "bcrypt";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { rows, count } = await UserService.getAllUsers(req.query);
    const reponse: GetAllResponse<User> = {
      status: "success",
      data: rows,
      results: rows.length,
      total: count,
    };

    res.json(reponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserService.createUser({
      username,
      password: hashedPassword,
    });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getAllUsers, createUser };
