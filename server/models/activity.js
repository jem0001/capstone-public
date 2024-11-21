const mongoose = require("mongoose");

// made this just to have unique id for each question
// throw in any fields, it unstructured !!
const QuestionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String,

  // for family-feud only
  answers: [{ answer: String, points: Number }],

  // for non-flip , drop-and-learn
  image: String,
  imageUrl: String,

  // for drop-and-learn-only
  name: String,
});

const ActivitySchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "Teacher",
    required: [true, "createdBy is a required field"],
  },
  name: {
    type: String,
    required: [true, "activity name is required"],
  },
  quarter: {
    type: String,
    enum: {
      values: ["quarter-1", "quarter-2", "quarter-3", "quarter-4"],
      message: "{VALUE} is not a valid type",
    },
    required: true,
  },
  week: {
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
    required: true,
  },
  activityNumber: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: {
      values: ["groupings", "individual"],
      message: "{VALUE} is not a valid type",
    },
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageLink: {
    type: String,
    required: true,
  },
  winPoints: {
    type: Number,
    default: null,
  },
  losePoints: {
    type: Number,
    default: null,
  },
  timer: {
    type: Number,
  },
  questions: [QuestionSchema],

  // for puzzle
  image: String,
  imageUrl: String,

  // for maps only
  place: String,
  modalPlace: String,
  modalDescription: String,
  streetViewURL: String,
  video: String,
  videoURL: String,

  // for drag-and-learn only
  title: String,
});

module.exports = mongoose.model("Activity", ActivitySchema);
