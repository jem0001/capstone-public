const {
  getAllStudent,
  addStudent,
  updateStudent,
  getOneStudent,
  deleteStudent,
  deleteAllStudent,
  validateQr,
} = require("../controllers/students");
const multer = require("multer");
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

router
  .route("/")
  .get(getAllStudent)
  .post(upload.single("qrImage"), addStudent)
  .delete(deleteAllStudent);

router.route("/validate-qr").post(validateQr);

router
  .route("/:studentId")
  .patch(upload.single("qrImage"), updateStudent)
  .delete(deleteStudent);

router.route("/:id").get(getOneStudent);

module.exports = router;
