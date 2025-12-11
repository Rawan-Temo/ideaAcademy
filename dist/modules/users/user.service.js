"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = require("./user.repository");
exports.UserService = {
    getAllUsers: (query) => {
        return user_repository_1.userRepository.getAll(query);
    },
    createUser: (data) => {
        return user_repository_1.userRepository.create(data);
    },
};
//# sourceMappingURL=user.service.js.map