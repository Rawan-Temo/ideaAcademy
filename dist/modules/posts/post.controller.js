"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteManyPosts = exports.updatePost = exports.getOnPost = exports.createPost = exports.getAllPosts = void 0;
const post_service_1 = require("./post.service");
// TODO Handle Multer
const getAllPosts = async (req, res) => {
    try {
        const { rows, count } = await post_service_1.PostService.getAllPosts(req.query);
        const response = {
            status: "success",
            data: rows,
            results: rows.length,
            total: count,
        };
        res.json(response);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAllPosts = getAllPosts;
const createPost = async (req, res) => {
    try {
        const { title, image, content } = req.body;
        const post = await post_service_1.PostService.createPost({
            title,
            image,
            content,
        });
        res.status(201).json(post);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createPost = createPost;
const getOnPost = async (req, res) => {
    try {
        const id = req.params.id;
        const post = await post_service_1.PostService.getPostById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(post);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getOnPost = getOnPost;
const updatePost = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const post = await post_service_1.PostService.updatePost(data, id);
        res.status(200).json(post);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updatePost = updatePost;
const deleteManyPosts = async (req, res) => {
    try {
        const ids = req.body.ids;
        const post = await post_service_1.PostService.deleteManyPosts(ids);
        res.status(200).json(post);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteManyPosts = deleteManyPosts;
//# sourceMappingURL=post.controller.js.map