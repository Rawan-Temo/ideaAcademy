import { Request, Response } from "express";
import { handleError } from "../../common/utils/handleError";
import {
  sendAll,
  sendCreated,
  sendNotFound,
  sendOne,
} from "../../common/utils/response";
import { courseService } from "./course.service";
import { CourseQueryDTO } from "./course.types";
import { GetAllResponse } from "../../common/types/apiResponse";
import { Course } from "../../generated/prisma/client";
import { id } from "zod/v4/locales";
import { deleteFile } from "../../common/middlewares/multerConfig";

const getALlCourses = async (
  req: Request<any, any, any, CourseQueryDTO>,
  res: Response,
) => {
  try {
    const { rows, count } = await courseService.getALlCourses(req.query);
    const response: GetAllResponse<Course> = {
      status: "success",
      data: rows,
      results: rows.length,
      total: count,
    };
    res.json(response);
  } catch (error) {
    console.error(error);
    handleError(error, res);
  }
};

const createCourse = async (req: Request, res: Response) => {
  try {
    if (req.files) {
      const files = req.files as MulterFiles;
      const image = files["image"]?.[0];
      image && (req.body.image = `/images/${image.filename}`);
      console.log(files);
      const video = files["video"]?.[0];
      video && (req.body.video = `/videos/${video.filename}`);
    }
    const course = await courseService.createCourse(req.body);
    sendCreated(res, course, "Course created successfully");
  } catch (error) {
    console.log(error);
    if (req.files) {
      Object.values(req.files).forEach((file: any) => {
        deleteFile(file[0].path);
      });
    }
    handleError(error, res);
  }
};

const getOneCourse = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const course = await courseService.getCourseById(id);
    sendOne(res, course);
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
};

const updateCourse = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const oldCourse = await courseService.getCourseById(id);
    if (!oldCourse) {
      sendNotFound(res, "Course not found");
    }
    const oldImage = oldCourse?.image;
    const oldVideo = oldCourse?.video;
    if (req.files) {
      const files = req.files as MulterFiles;
      const image = files["image"]?.[0];
      image && (req.body.image = `/images/${image.filename}`);
      const video = files["video"]?.[0];
      video && (req.body.video = `/videos/${video.filename}`);
    }
    const data = req.body;

    const course = await courseService.updateCourse(req.body, id);
    if (oldImage && oldImage !== course.image) {
      deleteFile(oldImage.slice(1));
    }
    if (oldVideo && oldVideo !== course.video) {
      deleteFile(oldVideo.slice(1));
    }
    sendOne(res, course, "Course updated successfully");
  } catch (error) {
    console.log(error);

    if (req.files) {
      Object.values(req.files).forEach((file: any) => {
        deleteFile(file[0].path);
      });
    }
    handleError(error, res);
  }
};

const deleteCourse = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const course = await courseService.deleteCourse(id);
    sendOne(res, course, "Course deleted successfully");
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
};

export {
  getALlCourses,
  createCourse,
  getOneCourse,
  updateCourse,
  deleteCourse,
};
