const express = require("express");
const {
  getAllHistory,
  deleteAllHistory,
  deleteHistory,
  addHistory,
  getIndividualChart,
  getDashboardChart,
} = require("../controllers/histories");
const router = express.Router();

router.route("/").post(addHistory).get(getAllHistory).delete(deleteAllHistory);
router.route("/:id").delete(deleteHistory);
router.route("/charts/:id").get(getIndividualChart);
router.route("/charts").get(getDashboardChart);

module.exports = router;
