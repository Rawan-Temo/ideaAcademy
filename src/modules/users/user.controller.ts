import { request, type Request, type Response } from "express";
import { UserService } from "./user.service";
import { User } from "../../generated/prisma/browser";
import { GetAllResponse } from "../../common/types/apiResponse";

import bcrypt from "bcrypt";
import { UserLoginDTO, UserQueryDto } from "./user.types";

const getAllUsers = async <T extends UserQueryDto>(
  req: Request<any, any, any, T>,
  res: Response
) => {
  try {
    console.log("hi");
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
const login = async (
  req: Request<any, any, UserLoginDTO, any>,
  res: Response
) => {
  try {
    console.log("test");
    let { username, password } = req.body;
    const user = await UserService.findByUsername(username);
    console.log(user);

    res.send("Hello WOrld!");
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export {
  login,
  getAllUsers,
  createUser,
  getOnUser,
  updateUser,
  deleteManyUsers,
};
