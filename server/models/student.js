const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "Teacher",
      required: [true, "createdBy is a required field"],
    },
    studentId: {
      type: String,
      required: [true, "studentId is a required field"],
    },
    firstName: {
      type: String,
      required: [true, "firstName is a required field"],
    },
    lastName: {
      type: String,
      required: [true, "lastName is a required field"],
    },
    fullName: {
      type: String,
      required: [true, "fullName is a required field"],
    },
    batch: {
      type: String,
      required: [true, "batch is a required field"],
    },
    section: {
      type: String,
      required: [true, "section is a required field"],
    },
    quarter: {
      type: String,
      enum: {
        values: ["quarter-1", "quarter-2", "quarter-3", "quarter-4"],
        message: "{VALUE} is not a valid type",
      },
      required: true,
    },
    qrImage: {
      type: String,
      required: [true, "qrImage is a required field"],
    },
    qrURL: {
      type: String,
    },
    individualPoints: {
      type: Number,
      default: 0,
    },
    groupingsPoints: {
      type: Number,
      default: 0,
    },
    completedGroupActs: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", StudentSchema);
