const CustomError = require("../error/custom-error");
const Activity = require("../models/activity");
const ActCollection = require("../models/actCollection");
const Week = require("../models/week");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const {
  CloudFrontClient,
  CreateInvalidationCommand,
} = require("@aws-sdk/client-cloudfront");
require("express-async-errors");
require("dotenv").config();
const crypto = require("crypto");

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

const getAllActivities = async (req, res) => {
  const { week, quarter, type } = req.query;
  const queryObject = { createdBy: req.user };

  if (week) {
    queryObject.week = week;
  }
  if (quarter) {
    queryObject.quarter = quarter;
  }
  // For counting counting overall group acts (quarter,type)
  if (type) {
    queryObject.type = type;
  }

  const activities = await Activity.find(queryObject).sort("_id");
  res.status(200).json({ nbHits: activities.length, activities });
};

const getActivity = async (req, res) => {
  const { id } = req.params;
  const queryObject = { createdBy: req.user };

  queryObject._id = id;

  const activity = await Activity.findOne(queryObject);

  if (!activity) {
    throw new CustomError(404, "no such activity");
  }
  res.status(200).json({ activity });
};

const addActivity = async (req, res) => {
  const { actId, week, quarter } = req.body;

  // Add Activity
  const act = await ActCollection.findOne({ _id: actId }).lean();
  const count = await Activity.countDocuments({
    createdBy: req.user,
    week,
    quarter,
  });
  const { _id, ...actWithoutId } = act;
  const docsObject = {
    createdBy: req.user,
    ...actWithoutId,
    week,
    quarter,
    activityNumber: count + 1,
  };

  const activity = await Activity.create(docsObject);

  res.status(201).json({ message: `New activity added to ${week}`, activity });
};

const deleteActivity = async (req, res) => {
  const { id } = req.params;
  const activity = await Activity.findOneAndDelete({ _id: id });
  if (!activity) {
    throw new CustomError(404, "No activity with such id");
  }

  await Activity.updateMany(
    {
      createdBy: req.user,
      quarter: activity.quarter,
      week: activity.week,
      activityNumber: { $gt: activity.activityNumber },
    },
    { $inc: { activityNumber: -1 } }
  );

  // delete map media in s3
  if (activity.name === "map") {
    if (activity.video !== "3d-default-video.mp4") {
      if (activity.modalImage !== "3d-default-image.png") {
        const command = new DeleteObjectCommand({
          Bucket: bucketName,
          Key: activity.video,
        });
        await s3.send(command);

        // Clear cloudfront cache
        const cfCommand = new CreateInvalidationCommand({
          DistributionId: cloudfrontDistributionId,
          InvalidationBatch: {
            CallerReference: `${activity.video}-${Date.now()}`,
            Paths: {
              Quantity: 1,
              Items: ["/" + activity.video],
            },
          },
        });
        await cloudfront.send(cfCommand);
      }
    }
  }

  // delete puzzle media in s3
  if (activity.name === "puzzle") {
    if (!activity.image.startsWith("default-")) {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: activity.image,
      });
      await s3.send(command);

      // Clear cloudfront cache
      const cfCommand = new CreateInvalidationCommand({
        DistributionId: cloudfrontDistributionId,
        InvalidationBatch: {
          CallerReference: `${activity.image}-${Date.now()}`,
          Paths: {
            Quantity: 1,
            Items: ["/" + activity.image],
          },
        },
      });
      await cloudfront.send(cfCommand);
    }
  }

  // delete non-flip-easy, drag-and-learn, flip media in s3
  if (
    activity.name === "non-flip-easy" ||
    activity.name === "non-flip-hard" ||
    activity.name === "drag-and-learn" ||
    activity.name === "flip"
  ) {
    for (const question of activity.questions) {
      if (!question.image.startsWith("default-")) {
        const command = new DeleteObjectCommand({
          Bucket: bucketName,
          Key: question.image,
        });
        await s3.send(command);

        // Clear cloudfront cache
        const cfCommand = new CreateInvalidationCommand({
          DistributionId: cloudfrontDistributionId,
          InvalidationBatch: {
            CallerReference: `${question.image}-${Date.now()}`,
            Paths: {
              Quantity: 1,
              Items: ["/" + question.image],
            },
          },
        });
        await cloudfront.send(cfCommand);
      }
    }
  }

  res.status(200).json({ message: "Activity deleted", activity });
};

const updateActivity = async (req, res) => {
  // console.log(
  //   "req.body>>>>",
  //   req.body,
  //   "req.files",
  //   req.files.imageFile[0],
  //   req.files.videoFile[0]
  // );
  const { id } = req.params;
  let { questions, imageIds } = req.body;

  if (imageIds) {
    imageIds = imageIds[0].split(",");
    imageIds = [...imageIds];
    console.log("imageIds", imageIds);
  }

  /*console.log("questionsss", questions);
  // console.log("imageIdsss", imageIds);
  console.log("imagefilesss", req.files);*/

  if (questions) {
    req.body.questions = JSON.parse(questions);
    questions = JSON.parse(questions);
  }
  const questionsLength = req.body.questions.length;

  const oneActivity = await Activity.findOne({ _id: id }).lean();
  if (!oneActivity) {
    throw new CustomError(404, "no activity with such id");
  }

  // console.log("req.body.questions", req.body.questions);
  // console.log("req.body.questions", req.body.questions.length);
  // console.log("oneActivity.questions", oneActivity.questions.length);
  // console.log("oneActivity.questions", oneActivity.questions.length);

  // Add Video
  let videoFileName = null;

  if (req.files.videoFile) {
    if (oneActivity.video === "3d-default-video.mp4") {
      videoFileName = crypto.randomBytes(32).toString("hex");
      req.body.videoURL = `${process.env.CLOUDFRONT_DOMAIN}/${videoFileName}`;
      req.body.video = videoFileName;
    } else {
      videoFileName = oneActivity.video;
    }
  }

  // Add Image To Puzzle
  let puzzleImageFileName = null;

  if (req.files.puzzleImageFile) {
    if (oneActivity.image.startsWith("default-")) {
      puzzleImageFileName = crypto.randomBytes(32).toString("hex");
      req.body.imageUrl = `${process.env.CLOUDFRONT_DOMAIN}/${puzzleImageFileName}`;
      req.body.image = puzzleImageFileName;
    } else {
      puzzleImageFileName = oneActivity.image;
    }
  }

  // Add Image To NonFlip
  let imageFileNames = [];

  // add imageFileNames, map question if question id === questionId and starts with, otherwise  return item and add
  // if not equals to imageId, dont't add to imageFileName
  if (req.files.imageFiles && req.files.imageFiles.length > 0) {
    req.body.questions = req.body.questions.map((item) => {
      let updatedItem = item; // Store the updated item here
      for (const imageId of imageIds) {
        if (
          item._id.toString() === imageId &&
          !item._id.toString().includes("added-")
        ) {
          console.log("enter dito counter", item.image);
          if (item.image.startsWith("default-")) {
            const imageFileName = crypto.randomBytes(32).toString("hex");
            imageFileNames = [...imageFileNames, imageFileName];
            updatedItem = {
              ...item,
              imageUrl: `${process.env.CLOUDFRONT_DOMAIN}/${imageFileName}`,
              image: imageFileName,
            };
          } else {
            imageFileNames = [...imageFileNames, item.image];
            updatedItem = item;
          }
        }
      }
      return updatedItem; // Return the updated item after the loop
    });

    console.log("before adding", req.body.questions);
    const containsAddedId = req.body.questions.some((item) =>
      item._id.startsWith("added-")
    );

    // Add new record
    if (containsAddedId) {
      req.body.questions = req.body.questions.filter(
        (item) => !item._id.startsWith("added")
      );
      const filteredImageIds = imageIds.filter((item) =>
        item.includes("added-")
      );
      for (const imageId of filteredImageIds) {
        console.log("pasok dito idol");
        const imageFileName = crypto.randomBytes(32).toString("hex");
        imageFileNames = [...imageFileNames, imageFileName];

        questions.forEach((item) => {
          if (item._id === imageId) {
            req.body.questions.push({
              ...item,
              imageUrl: `${process.env.CLOUDFRONT_DOMAIN}/${imageFileName}`,
              image: imageFileName,
            });
          }
        });
      }
    }
  }

  // console.log("after adding", req.body.questions);
  // console.log("mga filenames array id", imageFileNames);
  // // console.log("new req.body.questions", req.body.questions);

  // Remove _id before sending to db
  req.body.questions = req.body.questions.map(({ _id, ...item }) => item);

  const activity = await Activity.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });

  // ALL ABOUT CLOUD
  // Add/update video to s3
  if (req.files.videoFile) {
    const { buffer, mimetype } = req.files.videoFile[0];
    const videoCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: videoFileName,
      Body: buffer,
      ContentType: mimetype,
    });
    await s3.send(videoCommand);

    // Clear CloudFront cache for video
    if (
      oneActivity.video.trim().toLowerCase() !==
      "3d-default-video.mp4".toLowerCase()
    ) {
      const cfVideoCommand = new CreateInvalidationCommand({
        DistributionId: cloudfrontDistributionId,
        InvalidationBatch: {
          CallerReference: `${videoFileName}-${Date.now()}`,
          Paths: {
            Quantity: 1,
            Items: ["/" + videoFileName],
          },
        },
      });
      await cloudfront.send(cfVideoCommand);
    }
  }

  // Add/update puzzle image to s3
  if (req.files.puzzleImageFile) {
    const { buffer, mimetype } = req.files.puzzleImageFile[0];
    const imageCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: puzzleImageFileName,
      Body: buffer,
      ContentType: mimetype,
    });
    await s3.send(imageCommand);

    // Clear CloudFront cache for video
    if (!oneActivity.image.startsWith("default-")) {
      const cfVideoCommand = new CreateInvalidationCommand({
        DistributionId: cloudfrontDistributionId,
        InvalidationBatch: {
          CallerReference: `${puzzleImageFileName}-${Date.now()}`,
          Paths: {
            Quantity: 1,
            Items: ["/" + puzzleImageFileName],
          },
        },
      });
      await cloudfront.send(cfVideoCommand);
    }
  }

  // Add/update images to s3 for nonFlip
  if (req.files.imageFiles && req.files.imageFiles.length > 0) {
    for (let index = 0; index < req.files.imageFiles.length; index++) {
      const { buffer, mimetype } = req.files.imageFiles[index];
      const imageCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: imageFileNames[index],
        Body: buffer,
        ContentType: mimetype,
      });
      await s3.send(imageCommand);
    }

    // Clear CloudFront cache for video
    const imageIdsWithoutAdded = imageIds.filter(
      (item) => !item.includes("added-")
    );
    if (imageIdsWithoutAdded.length > 0) {
      for (let i = 0; i < imageIdsWithoutAdded.length; i++) {
        console.log("clearing cloudfront cache");
        const cfVideoCommand = new CreateInvalidationCommand({
          DistributionId: cloudfrontDistributionId,
          InvalidationBatch: {
            CallerReference: `${imageFileNames[i]}-${Date.now()}`,
            Paths: {
              Quantity: 1,
              Items: ["/" + imageFileNames[i]],
            },
          },
        });
        await cloudfront.send(cfVideoCommand);
      }
    }
  }

  // Delete images from s3 for nonFlip, drag-and-learn, flip
  if (
    oneActivity.name === "non-flip-easy" ||
    oneActivity.name === "non-flip-hard" ||
    oneActivity.name === "drag-and-learn" ||
    oneActivity.name === "flip"
  ) {
    const imagesToBeDeleted = oneActivity.questions.filter(
      (item1) =>
        !questions.some(
          (item2) => item2._id.toString() === item1._id.toString()
        )
    );
    // console.log("questions", questions);
    // console.log("oneActivity.questions", oneActivity.questions);
    // console.log("imagesToBeDeleted", imagesToBeDeleted);

    const imageNameToBeDeleted = imagesToBeDeleted.map((item) => item.image);
    for (const image of imageNameToBeDeleted) {
      if (!image.startsWith("default-")) {
        const command = new DeleteObjectCommand({
          Bucket: bucketName,
          Key: image,
        });
        await s3.send(command);

        // Clear cloudfront cache
        const cfCommand = new CreateInvalidationCommand({
          DistributionId: cloudfrontDistributionId,
          InvalidationBatch: {
            CallerReference: `${image}-${Date.now()}`,
            Paths: {
              Quantity: 1,
              Items: ["/" + image],
            },
          },
        });
        await cloudfront.send(cfCommand);
      }
    }
  }

  res.status(200).json({ message: "Activity updated", activity });
};

module.exports = {
  getAllActivities,
  getActivity,
  updateActivity,
  addActivity,
  deleteActivity,
};
