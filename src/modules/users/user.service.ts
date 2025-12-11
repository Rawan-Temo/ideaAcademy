import { Request } from "express";
import { userRepository } from "./user.repository";
import { CreateUserDTO, UpdateUserDTO } from "./user.types";

export const UserService = {
  getAllUsers: (query: Request["query"]) => {
    return userRepository.getAll(query);
  },
  createUser: (data: CreateUserDTO) => {
    return userRepository.create(data);
  },
  getUserById: (id: any) => {
    return userRepository.getById(id);
  },
  updateUser: (data: UpdateUserDTO, id: any) => {
    return userRepository.update(data, id);
  },
  deleteManyUsers: (ids: any[]) => {
    return userRepository.deleteMany(ids);
  },
};
