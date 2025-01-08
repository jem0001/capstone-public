const CustomError = require("../error/custom-error");
const Student = require("../models/student");
const History = require("../models/history");
const jwt = require("jsonwebtoken");
const { findOneAndUpdate } = require("../models/teacher");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const crypto = require("crypto");
const student = require("../models/student");
const {
  CloudFrontClient,
  CreateInvalidationCommand,
} = require("@aws-sdk/client-cloudfront");
const { query } = require("express");

require("dotenv").config();
require("express-async-errors");

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

// CLOUDFRONT CONFIG
const cloudfront = new CloudFrontClient({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

const getAllStudent = async (req, res) => {
  const {
    id,
    section,
    batch,
    quarter,
    search,
    sort = "",
    limit = 9,
    page = 1,
  } = req.query;
  const queryObject = { createdBy: req.user };

  if (section) {
    queryObject.section = section;
  }

  if (batch) {
    queryObject.batch = batch;
  }

  if (quarter) {
    queryObject.quarter = quarter;
  }

  if (search) {
    queryObject.fullName = { $regex: search, $options: "i" };
  }

  // For individual chart totalPoints under 'all quarters' tabs
  if (id) {
    const oneStudent = await Student.findOne({ _id: id });
    queryObject.studentId = oneStudent.studentId;
  }

  // Queryobject end

  let result = Student.find(queryObject);

  // // Sorting moved after aggregation
  // if (sort) {
  //   const sortList = sort.split(",").join(" ");
  //   result = result.collation({ locale: "en", strength: 2 }).sort(sortList);
  // }

  // Paginaton
  const skip = (page - 1) * limit;
  result = result.limit(limit).skip(skip);

  const studentTotalCount = await Student.countDocuments(queryObject);
  const totalPages = Math.ceil(studentTotalCount / limit);

  let students = await result.lean();

  if (students.length > 0) {
    for (const student of students) {
      student.qrURL = `${process.env.CLOUDFRONT_DOMAIN}/${student.qrImage}`;
    }
  }

  // Remove duplicate copies and total them
  // Aggregate student records
  const aggregatedStudents = students.reduce((acc, student) => {
    const { studentId, individualPoints, groupingsPoints, completedGroupActs } =
      student;

    if (!acc[studentId]) {
      acc[studentId] = { ...student };
      acc[studentId].individualPoints = individualPoints;
      acc[studentId].groupingsPoints = groupingsPoints;
      acc[studentId].completedGroupActs = completedGroupActs;
    } else {
      acc[studentId].individualPoints += individualPoints;
      acc[studentId].groupingsPoints += groupingsPoints;
      acc[studentId].completedGroupActs += completedGroupActs;
    }

    return acc;
  }, {});

  // Convert aggregated students to an array
  students = Object.values(aggregatedStudents);

  // Calculate totalPoints for each student, call it as points for frontend ease
  // clutch modification
  students.forEach((student) => {
    student.points = student.individualPoints + student.groupingsPoints;
  });

  // Apply sorting after aggregation
  if (sort) {
    const sortFields = sort.split(","); // Split by commas
    const sortObject = {};

    sortFields.forEach((field) => {
      const direction = field.startsWith("-") ? -1 : 1;
      const fieldName = field.replace("-", "");
      sortObject[fieldName] = direction;
    });

    students = students.sort((a, b) => {
      // Perform sorting manually based on the `sortObject`
      for (let field in sortObject) {
        if (a[field] !== b[field]) {
          return (a[field] < b[field] ? -1 : 1) * sortObject[field];
        }
      }
      return 0; // If they are equal, no change in order
    });
  }

  res.status(200).json({
    studentTotalCount,
    page,
    totalPages,
    nbHits: students.length,
    students,
  });
};

const addStudent = async (req, res) => {
  console.log("req.file>>>>", req.file, "req.body>>>>>", req.body);
  req.body.createdBy = req.user;
  const { studentId, firstName, lastName } = req.body;

  let fileName = null;

  if (req.file) {
    fileName = crypto.randomBytes(32).toString("hex");
    req.body.qrImage = fileName;
  }

  // Check if Student id is unique
  const isNotUnique = await Student.find({ studentId });
  if (isNotUnique.length) {
    throw new CustomError(404, "Student ID must be unique");
  }

  if (firstName && lastName) {
    req.body.fullName = `${firstName} ${lastName}`;
  }

  // Add same student with different quarter value
  req.body.quarter = "quarter-1";
  const student = await Student.create(req.body);

  req.body.quarter = "quarter-2";
  const studentV1 = await Student.create(req.body);

  req.body.quarter = "quarter-3";
  const studentV2 = await Student.create(req.body);

  req.body.quarter = "quarter-4";
  const studentV3 = await Student.create(req.body);

  // Add to S3
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  });

  await s3.send(command);
  student.qrURL = `${process.env.CLOUDFRONT_DOMAIN}/${student.qrImage}`;

  res.status(201).json({ student, message: "Student added" });
};

const updateStudent = async (req, res) => {
  const { studentId } = req.params;
  const { firstName, lastName } = req.body;

  if (firstName && lastName) {
    req.body.fullName = `${firstName} ${lastName}`;
  }

  // Find the student (to check existence and for S3/CloudFront)
  const student = await Student.findOne({
    createdBy: req.user,
    studentId: studentId,
  });

  if (!student) {
    return res
      .status(404)
      .json({ message: "No student found with the provided studentId" });
  }

  // Update the student
  const updatedStudents = await Student.updateMany(
    { createdBy: req.user, studentId: studentId },
    req.body,
    {
      runValidators: true,
    }
  );

  if (updatedStudents.modifiedCount === 0) {
    return res.status(404).json({ message: "No student records were updated" });
  }

  // Update in S3 (only if a new file is provided)
  if (req.file) {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: student.qrImage,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });

    await s3.send(command);
  }

  // Clear CloudFront cache
  const cfCommand = new CreateInvalidationCommand({
    DistributionId: cloudfrontDistributionId,
    InvalidationBatch: {
      CallerReference: `${student.qrImage}-${Date.now()}`,
      Paths: {
        Quantity: 1,
        Items: ["/" + student.qrImage],
      },
    },
  });
  await cloudfront.send(cfCommand);

  res
    .status(200)
    .json({ updatedStudents, message: "Student updated successfully" });
};

const getOneStudent = async (req, res) => {
  const { id } = req.params;
  const student = await Student.findOne({ createdBy: req.user, _id: id });

  if (!student) {
    throw new CustomError(404, "student not found");
  }

  student.qrURL = `https://d5bvvx354nxbm.cloudfront.net/${student.qrImage}`;
  res.status(200).json({ student, message: "student retrieved" });
};

// delete associated history as well
const deleteStudent = async (req, res) => {
  const { studentId } = req.params;

  const student = await Student.findOne({
    createdBy: req.user,
    studentId: studentId,
  });

  if (!student) {
    throw new CustomError(404, "No students found with the provided studentId");
  }

  // Get studentIds to be used to delete records in history collection
  const students = await Student.find({ createdBy: req.user, studentId });
  const studentIds = students.map((student) => student._id);

  const deletedStudents = await Student.deleteMany({
    createdBy: req.user,
    studentId: studentId,
  });

  if (deletedStudents.deletedCount === 0) {
    throw new CustomError(404, "No students found with the provided studentId");
  }

  // Delete in s3
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: student.qrImage,
  });
  await s3.send(command);

  // Clear cloudfront cache
  const cfCommand = new CreateInvalidationCommand({
    DistributionId: cloudfrontDistributionId,
    InvalidationBatch: {
      CallerReference: `${student.qrImage}-${Date.now()}`,
      Paths: {
        Quantity: 1,
        Items: ["/" + student.qrImage],
      },
    },
  });
  await cloudfront.send(cfCommand);

  // delete associated history
  const history = await History.deleteMany({ student: { $in: studentIds } });

  res.status(200).json({ student, message: "Student deleted" });
};

const deleteAllStudent = async (req, res) => {
  const student = await Student.deleteMany();
  const history = await History.deleteMany({ student: student._id });
  res.send("deleted all student");
};

const validateQr = async (req, res) => {
  const { studentId } = req.body;

  const student = await Student.findOne({ createdBy: req.user, studentId });
  if (!student) {
    throw new CustomError(404, "Invalid QR");
  }

  res.status(200).json({ message: "valid qr", student });
};
module.exports = {
  getAllStudent,
  addStudent,
  updateStudent,
  getOneStudent,
  deleteStudent,
  deleteAllStudent,
  validateQr,
};
