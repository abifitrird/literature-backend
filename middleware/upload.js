var multer = require("multer");

exports.uploadFile = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/files");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

  // filter file type
  const literatureFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(epub|pdf|EPUB|PDF)$/)) {
      req.fileValidationError = {
        message: "Only pdf/epub files are allowed!",
      };
      return cb(new Error("Only pdf/epub files are allowed!"), false);
    }
    cb(null, true);
  };

  // define maximum file size
  const maxSize = 10 * 1000 * 1000;

  var cpUpload = multer({
    storage: storage,
    fileFilter: literatureFilter,
    limits: {
      fileSize: maxSize,
    },
  }).fields([{ name: "file" }]);

  return (req, res, next) => {
    cpUpload(req, res, function (err) {
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      }

      // if (!req.file && !err) {
      //   console.log("validasi error");
      //   return res.status(400).send({
      //     message: "Please select a file to upload",
      //   });
      // }

      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            message: "Max file sized 10MB",
          });
        }
        return res.status(400).send(err);
      }

      return next();
    });
  };
};

exports.uploadImage = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/images");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

  // filter file type
  const imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      req.fileValidationError = {
        message: "Only image files are allowed!",
      };
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  };

  // define maximum file size
  const maxSize = 2 * 1000 * 1000;

  var cpUpload = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: {
      fileSize: maxSize,
    },
  }).fields([{ name: "photo" }]);

  return (req, res, next) => {
    cpUpload(req, res, function (err) {
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      }

      // if (!req.file && !err) {
      //   console.log("validasi error");
      //   return res.status(400).send({
      //     message: "Please select a file to upload",
      //   });
      // }

      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            message: "Max file sized 2MB",
          });
        }
        return res.status(400).send(err);
      }

      return next();
    });
  };
};
