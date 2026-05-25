import { ALL } from "dns";
import fs from "fs";
import multer from "multer";
import path from "path";
import { allowedNodeEnvironmentFlags } from "process";

const ALLOWED_IMAGE_TYPES = [
  "images/jpeg",
  "images/png",
  "images/png",
  "images/jpg",
  "images/webp",
];

const IMAGE_DIR = path.join(__dirname, "../../public/images");
const VIDEO_DIR = path.join(__dirname, "../../public/videos");

const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
// Helpers ===================
const ensureDir = async (folderPath: string): Promise<void> => {
  await fs.promises.mkdir(folderPath, { recursive: true });
  // recursive: true already does nothing if folder exists, no need to check first
};

const generateFileName = (file: Express.Multer.File) => {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const ext = path.extname(file.originalname);
  return `${file.fieldname}-${uniqueSuffix}${ext}`;
};

// Helpers ===================

// storage ===================
const storage = multer.memoryStorage();
// storage ===================

// FILTERS ===================
const imageFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type. Allowed: ${ALLOWED_IMAGE_TYPES.join(", ")}`,
      ),
    );
  }
};
const videoFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  if (ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type. Allowed: ${ALLOWED_VIDEO_TYPES.join(", ")}`,
      ),
    );
  }
};
const mediaFileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  const allowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type. Allowed: ${ALLOWED_VIDEO_TYPES.join(", ")}`,
      ),
    );
  }
};

const imageUpload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: MAX_IMAGE_SIZE },
});
const videoUpload = multer({
  storage,
  fileFilter: videoFilter,
  limits: { fileSize: MAX_VIDEO_SIZE },
});
const mediaUpload = multer({
  storage,
  fileFilter: mediaFileFilter,
  limits: { fileSize: MAX_VIDEO_SIZE },
});

// ─── Exports ──────────────────────────────────────────────────
export const uploadImage = imageUpload.single("image");
export const uploadVideo = videoUpload.single("video");
export const uploadMedia = mediaUpload.fields([
  // for routes that need both
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

// ─── Delete from Disk ─────────────────────────────────────────
export const deleteFile = async (filePath: string): Promise<void> => {
  const fullPath = path.isAbsolute(filePath)
    ? filePath
    : path.join(__dirname, "../../public", filePath);

  try {
    await fs.promises.unlink(fullPath);
  } catch (err: any) {
    if (err.code !== "ENOENT") throw err; // ENOENT = already gone, ignore it
  }
};
export const saveToDisk = async (
  file: Express.Multer.File,
): Promise<string> => {
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.mimetype);
  const uploadDir = isVideo ? VIDEO_DIR : IMAGE_DIR;

  await fs.promises.mkdir(uploadDir, { recursive: true });

  const filename = generateFileName(file);
  const fullPath = path.join(uploadDir, filename);

  await fs.promises.writeFile(fullPath, file.buffer);

  return fullPath; // return path to store in DB
};
