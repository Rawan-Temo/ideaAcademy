"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteManyUsers = exports.updateUser = exports.getOnUser = exports.createUser = exports.getAllUsers = exports.login = void 0;
exports.hashingPassword = hashingPassword;
const user_service_1 = require("./user.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateAccRefToken_1 = require("../../common/helpers/generateAccRefToken");
const response_1 = require("../../common/utils/response");
const getAllUsers = async (req, res) => {
    try {
        console.log("hi");
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
        const hashedPassword = await hashingPassword(password);
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
const getOnUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await user_service_1.UserService.getUserById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getOnUser = getOnUser;
const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        if (req.body.password) {
            req.body.password = await hashingPassword(req.body.password);
        }
        const user = await user_service_1.UserService.updateUser(data, id);
        res.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateUser = updateUser;
const deleteManyUsers = async (req, res) => {
    try {
        const ids = req.body.ids;
        const user = await user_service_1.UserService.deleteManyUsers(ids);
        res.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteManyUsers = deleteManyUsers;
async function hashingPassword(password) {
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    return hashedPassword;
}
const login = async (req, res) => {
    try {
        let { username, password } = req.body;
        const user = await user_service_1.UserService.findByUsername(username);
        if (!user) {
            return (0, response_1.sendBadRequest)(res, "Invalid Username or Password");
        }
        let isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return (0, response_1.sendBadRequest)(res, "Invalid Username or Password");
        }
        let accessToken = (0, generateAccRefToken_1.generateAccToken)(user);
        let refreshToken = (0, generateAccRefToken_1.generateRefToken)(user);
        await user_service_1.UserService.updateUser({ refreshToken }, user.id);
        (0, generateAccRefToken_1.setCookie)(res, refreshToken);
        res.status(200).json({
            accessToken,
            user: {
                id: user.id,
                username: user.username,
            },
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.login = login;
//# sourceMappingURL=user.controller.js.map