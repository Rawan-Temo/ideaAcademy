"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_controller_1 = require("./post.controller");
const validate_1 = require("../../common/middlewares/validate");
const post_validation_1 = require("./post.validation");
const postFields = [
    "title",
    "id",
    "content",
    "image",
    "createdAt",
    "updatedAt",
];
const router = express_1.default.Router();
// Define user-related routes here
router
    .route("/")
    .get((0, validate_1.validateQuery)(postFields), post_controller_1.getAllPosts)
    .post((0, validate_1.validateBody)(post_validation_1.createPostSchema), post_controller_1.createPost);
router.route("/delete-many").delete(post_controller_1.deleteManyPosts);
// T extends the post function itself u can set the request body
router
    .route("/:id")
    .get(post_controller_1.getOnPost)
    .patch((0, validate_1.validateBody)(post_validation_1.updatePostSchema), post_controller_1.updatePost);
exports.default = router;
//# sourceMappingURL=post.routes.js.map