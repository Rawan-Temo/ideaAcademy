"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseService = void 0;
const course_repository_1 = require("./course.repository");
exports.CourseService = {
    getAllCourses: (query) => {
        return course_repository_1.courseRepository.getAll(query);
    },
    createCourse: (data) => {
        return course_repository_1.courseRepository.create(data);
    },
    getCourseById: (id) => {
        return course_repository_1.courseRepository.getById(id);
    },
    updateCourse: (data, id) => {
        return course_repository_1.courseRepository.update(data, id);
    },
    deleteCourse: (id) => {
        return course_repository_1.courseRepository.delete(id);
    },
    deleteManyCourses: (ids) => {
        return course_repository_1.courseRepository.deleteMany(ids);
    },
};
//# sourceMappingURL=course.service.js.map