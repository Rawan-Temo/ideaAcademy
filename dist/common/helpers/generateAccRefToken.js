"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccToken = generateAccToken;
exports.generateRefToken = generateRefToken;
exports.setCookie = setCookie;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateAccToken(user) {
    return jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "4h",
    });
}
function generateRefToken(user) {
    return jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
    });
}
function setCookie(res, refreshToken) {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}
//# sourceMappingURL=generateAccRefToken.js.map