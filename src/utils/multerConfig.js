import multer from 'multer';
import { UPLOAD_DIR } from '../constans/links.js';

const multerConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${UPLOAD_DIR}`);
  },
  filename: function (req, file, cb) {
    const prefix = Date.now();
    cb(null, `${prefix}_${file.originalname}`);
  },
});

const upload = multer({ storage: multerConfig });

export default upload;
