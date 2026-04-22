"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteManyCourses = exports.deleteCourse = exports.updateCourse = exports.getOneCourse = exports.createCourse = exports.getAllCourses = void 0;
const course_service_1 = require("./course.service");
const getAllCourses = async (req, res) => {
    try {
        const { rows, count } = await course_service_1.CourseService.getAllCourses(req.query);
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
exports.getAllCourses = getAllCourses;
const createCourse = async (req, res) => {
    try {
        const course = await course_service_1.CourseService.createCourse(req.body);
        res.status(201).json(course);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createCourse = createCourse;
const getOneCourse = async (req, res) => {
    try {
        const id = req.params.id;
        const course = await course_service_1.CourseService.getCourseById(id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json(course);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getOneCourse = getOneCourse;
const updateCourse = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const course = await course_service_1.CourseService.updateCourse(data, id);
        res.status(200).json(course);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateCourse = updateCourse;
const deleteCourse = async (req, res) => {
    try {
        const id = req.params.id;
        await course_service_1.CourseService.deleteCourse(id);
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteCourse = deleteCourse;
const deleteManyCourses = async (req, res) => {
    try {
        const ids = req.body.ids;
        const result = await course_service_1.CourseService.deleteManyCourses(ids);
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteManyCourses = deleteManyCourses;
//# sourceMappingURL=course.controller.js.map