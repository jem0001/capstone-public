const CustomError = require("../error/custom-error");
const Teacher = require("../models/teacher");
const Week = require("../models/week");
const Activity = require("../models/activity");
const Student = require("../models/student");
const History = require("../models/history");

const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("express-async-errors");
require("dotenv").config();
const crypto = require("crypto");

const weeksDefaultJson = require("../utils/weeks-default.json");
const activitiesDefaultJson = require("../utils/activities-default.json");

const {
  CloudFrontClient,
  CreateInvalidationCommand,
} = require("@aws-sdk/client-cloudfront");
const activites = require("../models/activity");

// S3 CONFIG
const bucketRegion = process.env.BUCKET_REGION;
const bucketName = process.env.BUCKET_NAME;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const cloudfrontDistributionId = process.env.CLOUDFRONT_DISTRIBUTION_ID;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});
// S3 Config End

// Cloudfront Config
const cloudfront = new CloudFrontClient({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});
// Cloudfront Config End

const register = async (req, res) => {
  const { email } = req.body;

  // Check for duplicate email
  const teacherExist = await Teacher.findOne({ email });
  if (teacherExist) {
    throw new CustomError(400, "Email already exists");
  }

  // Create a new teacher
  const teacher = await Teacher.create(req.body);

  // Generate token
  const token = teacher.createToken();

  // Set up Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
    secure: true,
  });

  await new Promise((resolve, reject) => {
    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("Server is ready to take our messages");
        resolve(success);
      }
    });
  });

  // Compose email
  const mailOptions = {
    from: process.env.GMAIL,
    to: teacher.email,
    subject: "Welcome to our Platform - Account Verification",
    html: `
        <h1>Welcome to Our Platform!</h1>
        <p>Dear ${
          teacher.firstName.charAt(0).toUpperCase() + teacher.firstName.slice(1)
        },</p>
        <p>Thank you for registering on our platform. To complete your registration, please verify your email address by clicking the link below:</p>
        <a href="https://sayap.vercel.app/verify-email/${token}">Verify Your Email</a>
        <p>If you did not register on our platform, please ignore this email.</p>
        <p>Thank you,<br>Sayap Team</p>
      `,
  };

  res.status(201).json({
    teacher,
    token,
    message: "Please check your email for verification.",
  });

  // Send email
  await new Promise((resolve, reject) => {
    // send mail
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(info);
        resolve(info);
      }
    });
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const teacher = await Teacher.findOne({ email });

  if (!teacher) {
    throw new CustomError(401, "Authentication Error");
  }

  // Check if verified
  if (!teacher.isVerified) {
    throw new CustomError(
      401,
      "Email is not verified, please check your email"
    );
  }

  // Check if password match
  if (!(await teacher.comparePassword(password))) {
    throw new CustomError(401, "Authentication Error");
  }

  // Create token
  const token = teacher.createToken();
  // Give cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.status(200).json({ teacher, token, message: "Logged in" });
};

// Add week default and activities upon email verification
const verifyEmail = async (req, res) => {
  const { token } = req.params;
  let payload;
  try {
    payload = jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    throw new CustomError(401, "Invalid token");
  }
  const { _id } = payload;

  // Check if already verified
  const isVerified = await Teacher.findOne({ _id: _id });
  if (!isVerified) {
    throw new CustomError(404, "No teacher with id of " + _id);
  }
  if (isVerified.isVerified) {
    throw new CustomError(400, "Email is already verified");
  }

  const teacher = await Teacher.findOneAndUpdate(
    { _id: _id },
    { isVerified: true },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!teacher) {
    throw new CustomError(404, "No teacher with id of " + _id);
  }

  // add weeks-default
  const withCreatedBy = weeksDefaultJson.map((week) => {
    return { ...week, createdBy: _id };
  });
  const weeks = await Week.create(withCreatedBy);

  // add activities-default
  const actsWithCreatedBy = activitiesDefaultJson.map((activity) => {
    return { ...activity, createdBy: _id };
  });
  const activities = await Activity.create(actsWithCreatedBy);

  res
    .status(200)
    .json({ teacher, activities, weeks, message: "Email verified" });
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const teacher = await Teacher.findOne({ email });
  if (!teacher) {
    return res.status(400).json({ message: "Email not registered" });
  }

  const token = teacher.createToken();

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  await new Promise((resolve, reject) => {
    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("Server is ready to take our messages");
        resolve(success);
      }
    });
  });

  var mailOptions = {
    from: process.env.GMAIL,
    to: email,
    subject: "Reset Password",
    html: `
      <h1>Password Reset Request</h1>
      <p>Hi ${
        teacher.firstName.charAt(0).toUpperCase() + teacher.firstName.slice(1)
      },</p>
      <p>We received a request to reset your password for your account. Click the link below to reset your password:</p>
      <p><a href="https://sayap.vercel.app/resetPassword/${token}">Reset Password</a></p>
      <p>If you did not request a password reset, please ignore this email or contact our support team if you have any questions.</p>
      <p>Thank you,<br>Sayap Team</p>
    `,
  };

  res.status(200).json({
    token,
    status: true,
    message: "Email sent, check your email",
  });

  await new Promise((resolve, reject) => {
    // send mail
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(info);
        resolve(info);
      }
    });
  });
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  let payload;
  try {
    payload = jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    throw new CustomError(401, "Invalid token");
  }
  const id = payload._id;
  console.log(id);
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  await Teacher.findByIdAndUpdate({ _id: id }, { password: hashedPassword });
  return res.json({ status: true, message: "Password Updated" });
};

const verify = async (req, res) => {
  const teacher = await Teacher.findOne({ _id: req.user });

  if (!teacher) {
    throw new CustomError(401, "Authorization Error");
  }

  res.status(200).json({ message: "token verifed" });
};

const updateTeacher = async (req, res) => {
  console.log("body>>>", req.body, "file>>>>", req.file);
  const { password } = req.body;
  // hashpassword
  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
  }

  // Create new profilePic id if current = null;
  const teacherExist = await Teacher.findOne({ _id: req.user });
  console.log(">>teacherexist", teacherExist.profilePic);
  if (!teacherExist.profilePic) {
    req.body.profilePic = crypto.randomBytes(32).toString("hex");
  }

  const teacher = await Teacher.findOneAndUpdate({ _id: req.user }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!teacher) {
    throw new CustomError(404, "Teacher ID not found");
  }

  // update s3
  if (req.file) {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: teacher.profilePic,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });
    await s3.send(command);
  }

  // invalidate cloudfron cache
  const cfCommand = new CreateInvalidationCommand({
    DistributionId: cloudfrontDistributionId,
    InvalidationBatch: {
      CallerReference: `${teacher.profilePic}-${Date.now()}`,
      Paths: {
        Quantity: 1,
        Items: ["/" + teacher.profilePic],
      },
    },
  });

  await cloudfront.send(cfCommand);

  teacher.profilePicURL = `${process.env.CLOUDFRONT_DOMAIN}/${teacher.profilePic}`;
  res.status(200).json({ teacher, message: "Profile updated" });
};

const getOneTeacher = async (req, res) => {
  const { select } = req.query;

  let result = Teacher.findOne({ _id: req.user });

  // SELECT
  let selectList = "-password";
  if (select) {
    selectList = select.split(",").join(" ");
  }
  result = result.select(selectList);

  const teacher = await result;
  if (!teacher) {
    throw new CustomError(404, "Teacher not found");
  }

  if (!teacher.profilePic) {
    const defaultProfilePicURL =
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSteItzPyeDKBxyWiOA8xrPZXIlxOYv1b1VVg&s";
    teacher.profilePicURL = defaultProfilePicURL;
  } else {
    teacher.profilePicURL = `${process.env.CLOUDFRONT_DOMAIN}/${teacher.profilePic}`;
  }
  res.status(200).json({ teacher });
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const teacher = await Teacher.findOne({ _id: req.user });

  // Check if old Password is correct
  const isMatch = await teacher.comparePassword(oldPassword);
  if (!isMatch) {
    throw new CustomError(400, "Current Password doesn't match");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  const updatedTeacher = await Teacher.findOneAndUpdate(
    { _id: req.user },
    { password: hashedPassword },
    { new: true, runValidators: true }
  );

  res.status(200).json({ message: "Password updated" });
};

// TO BE DELETED
const resendEmail = async (req, res) => {
  const teacher = await Teacher.findOneAndUpdate(
    { email: req.body.email },
    { isVerified: true },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!teacher) {
    throw new CustomError(404, "Email not found");
  }

  res.status(200).json({ teacher, message: "Email verifed" });
};
const getAllTeachers = async (req, res) => {
  const teachers = await Teacher.find();
  res.status(200).json({ teachers });
};

const deleteTeachers = async (req, res) => {
  const teacher = await Teacher.deleteMany();
  const student = await Student.deleteMany();
  const history = await History.deleteMany();
  const activity = await Activity.deleteMany();
  const week = await Week.deleteMany();

  res.send("Teachers and all related data was deleted");
};

const deleteTeacher = async (req, res) => {
  const { id } = req.params;
  const teacher = await Teacher.findOneAndDelete({ _id: id });
  if (!teacher) {
    throw new CustomError(404, "no teacher with such id");
  }
  const student = await Student.deleteMany({ createdBy: id });
  const history = await History.deleteMany({ createdBy: id });
  const activity = await Activity.deleteMany({ createdBy: id });
  const week = await Week.deleteMany({ createdBy: id });

  res.send("One Teacher and all related data was deleted");
};

module.exports = {
  login,
  register,
  getAllTeachers,
  verifyEmail,
  resendEmail,
  verify,
  logout,
  forgotPassword,
  resetPassword,
  updateTeacher,
  getOneTeacher,
  changePassword,
  deleteTeachers,
  deleteTeacher,
};
