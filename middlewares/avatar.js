import multer from "multer";
import path from "path";
import crypto from "node:crypto";

const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("tmp"));
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extname);
    const suffix = crypto.randomUUID();

    const filename = `${basename}-${suffix}${extname}`;

    cb(null, filename);
  },
});

// File middleware which save file under the original name
const upload = multer({
  storage: multerConfig,
});

export default upload;
