const express = require("express");
const { getActCollection } = require("../controllers/actCollections");

const router = express.Router();

router.route("/").get(getActCollection);

module.exports = router;
