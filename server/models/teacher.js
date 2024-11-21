const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const TeacherSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstName field is required"],
    },
    lastName: {
      type: String,
      required: [true, "lastName field is required"],
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password field is required"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    //OPTIONAL
    profilePic: {
      type: String,
      default: null,
    },
    profilePicURL: {
      type: String,
    },
  },
  { timestamps: true }
);

TeacherSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
});
TeacherSchema.methods.createToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, {
    expiresIn: "30d",
  });
  return token;
};
TeacherSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

module.exports = mongoose.model("Teacher", TeacherSchema);
