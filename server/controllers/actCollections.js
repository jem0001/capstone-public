const ActCollection = require("../models/actCollection");
require("express-async-errors");

const getActCollection = async (req, res) => {
  const actCollections = await ActCollection.find().sort("name");

  res.status(200).json({ actCollections });
};

module.exports = { getActCollection };
