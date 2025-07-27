import * as multer from 'multer';
import * as path from 'path';

const MulterOptions = {
  storage: multer.diskStorage({
    filename: (req, file, cb) => {
      cb(
        null,
        `cv-${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
      );
    },
  }),
  limits: { fileSize: 100000000 }, // Limit file size to 100MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
};

function checkFileType(
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  const filetypes = /pdf/;  // Changed to only accept PDF
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: PDF files only!')); // Updated error message
  }
}

export default MulterOptions;
