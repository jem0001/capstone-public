const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    student: {
      type: mongoose.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    pointsAdded: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["won", "lost"],
        message: "{VALUE} is not a valid type",
      },
      required: true,
    },
    type: {
      type: String,
      enum: {
        values: ["individual", "groupings"],
        message: "{VALUE} is not a valid type",
      },
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    week: {
      type: String,
      required: true,
    },
    quarter: {
      type: String,
      required: true,
    },
    activityNumber: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  }
  // { timestamps: true }
);

module.exports = mongoose.model("History", HistorySchema);
