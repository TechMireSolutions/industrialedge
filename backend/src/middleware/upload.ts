import multer from 'multer';
import { config } from '../config/index.js';
import { AppError } from '../middleware/errorHandler.js';

const storage = multer.memoryStorage();

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!config.upload.allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new AppError(
        400,
        `Invalid file type. Allowed: ${config.upload.allowedMimeTypes.join(', ')}`
      )
    );
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize,
  },
});

export const uploadSingle = (fieldName: string) =>
  upload.single(fieldName);

export const uploadArray = (fieldName: string, maxCount: number) =>
  upload.array(fieldName, maxCount);

export const uploadFields = (fields: multer.Field[]) =>
  upload.fields(fields);
