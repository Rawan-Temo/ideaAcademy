"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body); // throws if invalid
            next();
        }
        catch (err) {
            res.status(400).json({ message: err.errors || err.message });
        }
    };
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map