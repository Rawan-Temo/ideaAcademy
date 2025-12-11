"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getAllUsers = void 0;
const user_service_1 = require("./user.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const getAllUsers = async (req, res) => {
    try {
        const { rows, count } = await user_service_1.UserService.getAllUsers(req.query);
        const reponse = {
            status: "success",
            data: rows,
            results: rows.length,
            total: count,
        };
        res.json(reponse);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAllUsers = getAllUsers;
const createUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await user_service_1.UserService.createUser({
            username,
            password: hashedPassword,
        });
        res.status(201).json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createUser = createUser;
//# sourceMappingURL=user.controller.js.map