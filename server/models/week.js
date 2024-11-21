const mongoose = require("mongoose");

const WeekSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "Teacher",
    required: [true, "weeks createdBy is required"],
  },
  name: {
    type: String,
    enum: {
      values: [
        "week-1",
        "week-2",
        "week-3",
        "week-4",
        "week-5",
        "week-6",
        "week-7",
        "week-8",
        "week-9",
        "week-10",
        "week-11",
        "week-12",
        "week-13",
        "week-14",
      ],
      message: "{VALUE} is not a valid week name",
    },
    required: [true, "Week name is required"],
  },
  quarter: {
    type: String,
    enum: {
      values: ["quarter-1", "quarter-2", "quarter-3", "quarter-4"],
      message: "{VALUE} is not a valid type",
    },
    required: true,
  },
  lessonTitle: {
    type: String,
    required: [true, "lessonTitle is a required field"],
  },
  open: {
    type: Boolean,
    default: false,
  },
  // // imageLink is optional
  // imageLink: {
  //   type: String,
  //   // default:
  //   //   "https://media.istockphoto.com/id/524923923/vector/days-of-the-week.jpg?s=612x612&w=0&k=20&c=ywy06vW_cTZFExK-fH2PUB9E1FlBlMbku_1sLqnUPDE=",
  // },
});

module.exports = mongoose.model("Week", WeekSchema);
