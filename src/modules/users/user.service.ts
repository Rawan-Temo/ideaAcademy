import { userRepository } from "./user.repository";
import { CreateUserDTO } from "./user.types";

export const UserService = {
  getAllUsers: (query: any) => {
    return userRepository.getAll(query);
  },
  createUser: (data: CreateUserDTO) => {
    return userRepository.create(data);
  },
};
