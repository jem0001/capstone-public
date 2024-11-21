const express = require("express");
const {
  getAllWeeks,
  updateWeek,
  addWeek,
  getWeek,
  deleteWeek,
} = require("../controllers/week");

const router = express.Router();

router.route("/").get(getAllWeeks).post(addWeek);
router.route("/:id").get(getWeek).patch(updateWeek).delete(deleteWeek);

module.exports = router;
