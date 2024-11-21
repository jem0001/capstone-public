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

// fields to be added later - quarter,week,activityNumber
const ActCollectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "activity name is required"],
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

module.exports = mongoose.model("ActCollection", ActCollectionSchema);
