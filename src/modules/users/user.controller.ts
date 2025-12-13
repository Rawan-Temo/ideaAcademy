import type { Request, Response } from "express";
import { UserService } from "./user.service";
import { User } from "../../generated/prisma/browser";
import { GetAllResponse } from "../../common/types/apiResponse";

import bcrypt from "bcrypt";
import { UserQueryDto } from "./user.types";

const getAllUsers = async <T extends UserQueryDto>(
  req: Request<any, any, any, T>,
  res: Response
) => {
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
    const hashedPassword = await hashingPassword(password);
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
const getOnUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await UserService.getUserById(id);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const data = req.body;
    if (req.body.password) {
      req.body.password = await hashingPassword(req.body.password);
    }
    const user = await UserService.updateUser(data, id);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const deleteManyUsers = async (req: Request, res: Response) => {
  try {
    const ids = req.body.ids;
    const user = await UserService.deleteManyUsers(ids);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
async function hashingPassword(password: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}
export { getAllUsers, createUser, getOnUser, updateUser, deleteManyUsers };
