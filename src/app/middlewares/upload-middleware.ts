import { injectable } from 'inversify';
import multer from 'multer';
import type { Request, RequestHandler } from 'express';

export interface IUploadMiddleware {
  single(fieldName: string): RequestHandler;
  getMulter(): multer.Multer;
}

@injectable()
export class UploadMiddleware implements IUploadMiddleware {
  private readonly multerInstance: multer.Multer;

  constructor() {
    // Configure multer to use memory storage
    const storage = multer.memoryStorage();

    // File filter to only allow images
    const fileFilter = (
      _req: Request,
      file: Express.Multer.File,
      cb: multer.FileFilterCallback
    ) => {
      const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
      ];

      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only image files are allowed.'));
      }
    };

    this.multerInstance = multer({
      storage,
      fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
      },
    });
  }

  single(fieldName: string) {
    return this.multerInstance.single(fieldName);
  }

  getMulter() {
    return this.multerInstance;
  }
}
