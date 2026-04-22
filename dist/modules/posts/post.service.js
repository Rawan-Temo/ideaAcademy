"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const post_repository_1 = require("./post.repository");
exports.PostService = {
    getAllPosts: (query) => {
        return post_repository_1.postRepository.getAll(query);
    },
    createPost: (data) => {
        return post_repository_1.postRepository.create(data);
    },
    getPostById: (id) => {
        return post_repository_1.postRepository.getById(id);
    },
    updatePost: (data, id) => {
        return post_repository_1.postRepository.update(data, id);
    },
    deleteManyPosts: (ids) => {
        return post_repository_1.postRepository.deleteMany(ids);
    },
};
//# sourceMappingURL=post.service.js.map