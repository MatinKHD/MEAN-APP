const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("mime type is invalid");
    const urlPath = req.route.path.split("/");

    if (isValid) error = null;

    if (urlPath.includes("users")) {
      cb(error, "backend/images/user-profile");
    } else if (urlPath.includes("posts")) {
      cb(error, "backend/images");
    }
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

module.exports = multer({ storage }).single("image");
