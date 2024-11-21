const CustomError = require("../error/custom-error");
const Week = require("../models/week");
const Activity = require("../models/activity");
require("express-async-errors");
const mongoose = require("mongoose");

const getAllWeeks = async (req, res) => {
  const { quarter } = req.query;
  const queryObject = { createdBy: new mongoose.Types.ObjectId(`${req.user}`) };

  // Query objects
  if (quarter) {
    queryObject.quarter = quarter;
  }

  const weeks = await Week.aggregate([
    { $match: queryObject },
    {
      $addFields: {
        weekNumber: {
          $toInt: {
            $arrayElemAt: [{ $split: ["$name", "-"] }, 1],
          },
        },
      },
    },
    { $sort: { weekNumber: 1 } },
    { $project: { weekNumber: 0 } },
  ]);

  res.status(200).json({ nbHits: weeks.length, weeks });
};

const addWeek = async (req, res) => {
  // check if week name is unique
  const { name, quarter, lessonTitle, open } = req.body;

  const weekNotUnique = await Week.findOne({
    createdBy: req.user,
    name,
    quarter,
  });

  if (weekNotUnique) {
    throw new CustomError(400, "Week number must be unique");
  }

  const week = await Week.create({ createdBy: req.user, ...req.body });
  res.status(201).json({ week, message: "New week added" });
};

const getWeek = async (req, res) => {
  const { id } = req.params;
  const week = await Week.findOne({ _id: id });

  if (!week) {
    throw new CustomError(404, "no week with id of");
  }

  res.status(200).json({ week });
};

const deleteWeek = async (req, res) => {
  const { id } = req.params;
  const week = await Week.findOneAndDelete({ _id: id });

  if (!week) {
    throw new CustomError(404, "no week with such id");
  }

  // delete activites under that week
  const activities = await Activity.deleteMany({
    createdBy: req.user,
    quarter: week.quarter,
    week: week.name,
  });

  res.status(200).json({ week, activities, message: `${week.name} deleted` });
};

const updateWeek = async (req, res) => {
  // check if week name is unique
  const { id } = req.params;
  const { name, quarter } = req.body;

  const weekNotUnique = await Week.findOne({
    createdBy: req.user,
    name,
    quarter,
  });

  const oneWeek = await Week.findOne({ _id: id });

  if (weekNotUnique && oneWeek.name !== name) {
    throw new CustomError(400, "Week number must be unique");
  }

  const week = await Week.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!week) {
    throw new CustomError(404, "No week with such id");
  }

  if (req.body.open) {
    res.status(201).json({ week, message: "Week open status updated" });
    return;
  }
  res.status(201).json({ week, message: "Week updated" });
};

module.exports = { getAllWeeks, updateWeek, addWeek, getWeek, deleteWeek };
