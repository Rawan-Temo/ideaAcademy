"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAll = sendAll;
exports.sendCreated = sendCreated;
exports.sendOne = sendOne;
exports.sendNoContent = sendNoContent;
exports.sendNotFound = sendNotFound;
exports.sendBadRequest = sendBadRequest;
exports.sendInternalServerError = sendInternalServerError;
exports.sendUnauthorized = sendUnauthorized;
exports.sendForbidden = sendForbidden;
function sendAll(res, data, statusCode = 200, total) {
    const response = {
        status: "success",
        data,
        results: data.length,
        total,
    };
    res.status(statusCode).json(response);
}
function sendCreated(res, data, message) {
    const response = {
        status: "success",
        data,
        message,
    };
    res.status(201).json(response);
}
function sendOne(res, data, message) {
    const response = {
        status: "success",
        data,
        message,
    };
    res.status(200).json(response);
}
function sendNoContent(res) {
    res.status(204).send();
}
function sendNotFound(res, messsage) {
    res.status(404).json({
        status: "error",
        message: messsage || "Resource not found",
    });
}
function sendBadRequest(res, messsage) {
    res.status(400).json({
        status: "error",
        message: messsage,
    });
}
function sendInternalServerError(res, messsage) {
    res.status(500).json({
        status: "error",
        message: messsage || "Internal server error",
    });
}
function sendUnauthorized(res, messsage) {
    res.status(401).json({
        status: "error",
        message: messsage || "Unauthorized",
    });
}
function sendForbidden(res, messsage) {
    res.status(403).json({
        status: "error",
        message: messsage || "Forbidden",
    });
}
//# sourceMappingURL=response.js.map