const express = require("express");
const {
  getAllActivities,
  getActivity,
  updateActivity,
  addActivity,
  deleteActivity,
} = require("../controllers/activities");
const multer = require("multer");
const CustomError = require("../error/custom-error");

// Configure Multer
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "videoFile") {
    const allowedVideoTypes = /video\/(mp4|mkv|webm|avi|mov|wmv|flv)/;
    const isVideo = allowedVideoTypes.test(file.mimetype);
    return isVideo
      ? cb(null, true)
      : cb(
          new CustomError(
            400,
            "Only video files are accepted. Allowed types: mp4, mkv, webm, avi, mov, wmv, flv."
          )
        );
  }

  if (file.fieldname === "imageFiles" || file.fieldname === "puzzleImageFile") {
    const allowedImageTypes = /image\/(jpeg|jpg|png|gif)/;
    const isImage = allowedImageTypes.test(file.mimetype);
    return isImage
      ? cb(null, true)
      : cb(
          new CustomError(
            400,
            "Only image files are accepted. Allowed types: jpeg, jpg, png, gif."
          )
        );
  }

  cb(new CustomError(400, "Unsupported file type."));
};

// Create a single Multer instance with combined configuration
const upload = multer({ storage, fileFilter });

const router = express.Router();

router.route("/").get(getAllActivities).post(addActivity);
router
  .route("/:id")
  .patch(
    upload.fields([
      { name: "videoFile", maxCount: 1 },
      { name: "imageFiles" },
      { name: "puzzleImageFile", maxCount: 1 }, // Add the new field here
    ]),
    updateActivity
  )
  .delete(deleteActivity)
  .get(getActivity);

module.exports = router;
