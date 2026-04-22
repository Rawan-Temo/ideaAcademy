"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowedTo = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_service_1 = require("../../modules/users/user.service");
const response_1 = require("../utils/response");
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1];
        if (!token) {
            (0, response_1.sendUnauthorized)(res, "No token provided");
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
        const foundUser = await user_service_1.UserService.getUserById(decoded.userId);
        if (!foundUser) {
            (0, response_1.sendUnauthorized)(res, "Invalid token");
            return;
        }
        req.user = foundUser;
        next();
    }
    catch (error) {
        console.error(error);
        (0, response_1.sendInternalServerError)(res, "Internal server error");
    }
};
exports.authenticateToken = authenticateToken;
const allowedTo = (...roles) => {
    return (req, res, next) => {
        const currentUser = req.user;
        if (!currentUser) {
            (0, response_1.sendForbidden)(res, "Forbidden");
            return;
        }
        if (!roles.includes(currentUser.role)) {
            (0, response_1.sendForbidden)(res, "Forbidden");
            return;
        }
        next();
    };
};
exports.allowedTo = allowedTo;
//# sourceMappingURL=authMiddleware.js.map