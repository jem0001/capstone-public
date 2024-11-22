const {
  register,
  login,
  getAllTeachers,
  verifyEmail,
  resendEmail,
  verify,
  logout,
  forgotPassword,
  resetPassword,
  updateTeacher,
  getOneTeacher,
  changePassword,
  deleteTeachers,
  deleteTeacher,
} = require("../controllers/auth");
const multer = require("multer");
const authentication = require("../middlewares/authentication");
const CustomError = require("../error/custom-error");

// MULTER CONFIG
const storage = multer.memoryStorage();
function fileFilter(req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype) {
    return cb(null, true);
  } else {
    cb(new CustomError(400, "only accepts image file such as jpeg,jgp,png"));
  }
}
const upload = multer({ storage: storage, fileFilter });

const router = require("express").Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/verify-email/:token").get(verifyEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/verify").get(authentication, verify);
router.route("/change-password").post(authentication, changePassword);
router
  .route("/update-teacher")
  .patch(authentication, upload.single("profilePic"), updateTeacher);
router.route("/profile").get(authentication, getOneTeacher);
router.route("/").get(getAllTeachers).delete(deleteTeachers);
router.route("/:id").delete(deleteTeacher);

// TOBE DELETED
router.route("/resend").patch(resendEmail);

module.exports = router;
