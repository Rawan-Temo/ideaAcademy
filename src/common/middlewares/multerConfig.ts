import fs from "fs";
import multer from "multer";
import path from "path";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];

const IMAGE_DIR = path.join(__dirname, "../../../public/images");
const VIDEO_DIR = path.join(__dirname, "../../../public/videos");

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
};

const generateFileName = (file: Express.Multer.File) => {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const ext = path.extname(file.originalname);
  return `${file.fieldname}-${uniqueSuffix}${ext}`;
};

// Helpers ===================

// storage ===================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.mimetype);
    const uploadDir = isVideo ? VIDEO_DIR : IMAGE_DIR;
    ensureDir(uploadDir);
    //TODO handle error here
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const name = generateFileName(file);
    cb(null, name);
  },
});
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

  if (
    (file.fieldname === "image" &&
      ALLOWED_IMAGE_TYPES.includes(file.mimetype)) ||
    (file.fieldname === "video" && ALLOWED_VIDEO_TYPES.includes(file.mimetype))
  ) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: ${allowedTypes.join(", ")}`));
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
    : path.join(__dirname, "../../../public", filePath);

  try {
    await fs.promises.unlink(fullPath);
  } catch (err: any) {
    if (err.code !== "ENOENT") throw err; // ENOENT = already gone, ignore it
  }
};
