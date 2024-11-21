const { query } = require("express");
const CustomError = require("../error/custom-error");
const History = require("../models/history");
const Student = require("../models/student");
const mongoose = require("mongoose");
require("express-async-errors");
const {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  subDays,
  subWeeks,
  addWeeks,
  setDay,
  format,
  startOfMonth,
  endOfMonth,
  subMonths,
  eachDayOfInterval,
  addMonths,
  startOfYear,
} = require("date-fns");

// Add points to history and student
const addHistory = async (req, res) => {
  req.body.createdBy = req.user;
  const {
    student,
    pointsAdded,
    status,
    type,
    from,
    week,
    activityNumber,
    quarter,
  } = req.body;

  // Get student Id
  const oneStudent = await Student.findOne({
    createdBy: req.user,
    studentId: student,
    quarter,
  });
  if (!oneStudent) {
    throw new CustomError(404, "no student with such id");
  }

  req.body.student = oneStudent._id;

  const history = await History.create(req.body);

  // Add points to Student collection
  const updateObject = {};
  if (type === "individual") {
    updateObject.individualPoints =
      oneStudent.individualPoints + Number(pointsAdded);
  } else if (type === "groupings") {
    updateObject.groupingsPoints =
      oneStudent.groupingsPoints + Number(pointsAdded);
    updateObject.completedGroupActs = oneStudent.completedGroupActs + 1;
  }

  const updatedStudent = await Student.findOneAndUpdate(
    { _id: oneStudent._id },
    updateObject,
    {
      new: true,
      runValidators: true,
    }
  );

  res
    .status(201)
    .json({ message: "History added", history, student: updatedStudent });
};

const deleteHistory = async (req, res) => {
  const { id } = req.params;
  const history = await History.findOneAndDelete({ _id: id });

  if (!history) {
    throw new CustomError(404, "no history record with such id");
  }

  // update Student Collection
  // Get student Id
  const oneStudent = await Student.findOne({ _id: history.student });
  if (!oneStudent) {
    throw new CustomError(404, "no student with such id");
  }

  const updateObject = {};
  if (history.type === "individual") {
    updateObject.individualPoints =
      oneStudent.individualPoints - history.pointsAdded;
  } else if (history.type === "groupings") {
    updateObject.groupingsPoints =
      oneStudent.groupingsPoints - history.pointsAdded;
    updateObject.completedGroupActs = oneStudent.completedGroupActs - 1;
  }

  const updatedStudent = await Student.findOneAndUpdate(
    { _id: history.student },
    updateObject,
    {
      new: true,
      runValidators: true,
    }
  );

  res
    .status(200)
    .json({ message: "record deleted", history, student: updatedStudent });
};

const deleteAllHistory = async (req, res) => {
  const histories = await History.deleteMany();
  const updatedStudents = await Student.updateMany(
    {},
    { individualPoints: 0, groupingsPoints: 0, completedGroupActs: 0 }
  );

  res.status(200).json({ histories, updatedStudents });
};

const getAllHistory = async (req, res) => {
  const {
    studentId,
    quarter,
    batch,
    section,
    status,
    sort = "-createdAt",
    dateFilter,
    type,
  } = req.query;
  const queryObject = { createdBy: req.user };
  const studentQueryObject = {};

  if (studentId) {
    // for win/lose ratio
    const oneStudent = await Student.findOne({
      _id: studentId,
    });
    studentQueryObject.studentId = oneStudent.studentId;
    if (quarter) {
      queryObject.quarter = quarter;
    }
  }

  if (batch) {
    studentQueryObject.batch = batch;
  }
  if (section) {
    studentQueryObject.section = section;
  }
  if (status) {
    queryObject.status = status;
  }
  if (type) {
    queryObject.type = type;
  }
  if (dateFilter) {
    // Handle date filters
    let dateRange;
    const today = new Date();
    switch (dateFilter) {
      case "today":
        dateRange = {
          $gte: startOfDay(today),
          $lt: endOfDay(today),
        };
        break;
      case "yesterday":
        dateRange = {
          $gte: startOfDay(subDays(today, 1)),
          $lt: endOfDay(subDays(today, 1)),
        };
        break;
      case "thisWeek":
        dateRange = {
          $gte: startOfWeek(today),
          $lt: endOfWeek(today),
        };
        break;
      case "lastWeek":
        dateRange = {
          $gte: startOfWeek(subWeeks(today, 1)),
          $lt: endOfWeek(subWeeks(today, 1)),
        };
        break;
      default:
        dateRange = "";
    }

    queryObject.createdAt = dateRange;
  }

  let result;
  let histories;
  // For individual graph and pts history
  if (section || batch) {
    result = History.find(queryObject).populate({
      path: "student",
      match: studentQueryObject,
    });

    if (sort) {
      const sortList = sort.split(",").join(" ");
      result = result.sort(sortList);
    }

    histories = await result;
    // Filter out histories where the student does not match the section/batch criteria
    histories = histories.filter((history) => history.student);
  }
  // For win/lose ratio
  else if (studentId) {
    console.log("hell", studentQueryObject);
    result = History.find(queryObject).populate({
      path: "student",
      match: studentQueryObject,
    });

    histories = await result;
    // console.log(histories);
    histories = histories.filter((history) => history.student);
  }
  // For teachers dashboard
  else {
    result = History.find(queryObject).populate("student");
    histories = await result;
  }

  //
  res.status(200).json({ nbHits: histories.length, histories });
};

const getIndividualChart = async (req, res) => {
  const { id } = req.params;
  const { chartType, type, dateFilter, quarter } = req.query;

  if (!chartType) {
    throw new CustomError(400, "chartType is a required query params");
  }

  const oneStudent = await Student.findOne({ _id: id });

  const queryObject = {
    createdBy: new mongoose.Types.ObjectId(`${req.user}`),
  };

  const studentObject = {
    studentId: oneStudent.studentId,
  };

  // Queries section
  if (type) {
    queryObject.type = type;
  }
  if (quarter) {
    queryObject.quarter = quarter;
  }

  let histories;
  if (chartType === "pie") {
    histories = await History.aggregate([
      {
        $match: queryObject, // Match initial query object
      },
      {
        $lookup: {
          from: "students", // Replace with your actual student collection name
          localField: "student",
          foreignField: "_id",
          as: "studentDetails",
        },
      },
      {
        $unwind: "$studentDetails", // Unwind the student array to filter documents without a matching student
      },
      {
        $match: { "studentDetails.studentId": oneStudent.studentId }, // Match based on studentObject criteria
      },
      {
        $group: {
          _id: quarter === "" ? "$quarter" : "$week",

          totalPoints: { $sum: "$pointsAdded" }, // Sum the pointsAdded for each week
        },
      },
      {
        $addFields: {
          weekNumber: {
            $toInt: { $arrayElemAt: [{ $split: ["$_id", "-"] }, 1] }, // Extract the week number and convert to integer
          },
        },
      },
      {
        $sort: { weekNumber: 1 }, // Sort by the week number
      },
      { $project: { weekNumber: 0 } },
    ]);
    console.log("chatpie", histories);
  }

  if (chartType === "bar") {
    const today = Date.now();
    let startDate = null;
    let endDate = null;

    if (dateFilter === "thisWeek" || dateFilter === "lastWeek") {
      if (dateFilter === "thisWeek") {
        startDate = startOfWeek(today, { weekStartsOn: 1 });
        let tempEndDate = endOfWeek(today, { weekStartsOn: 1 });
        endDate = tempEndDate;
        // endDate = subDays(tempEndDate, 2);
        // code above removes weekend
      } else {
        startDate = startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
        endDate = endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
      }

      queryObject.createdAt = { $gte: startDate, $lt: endDate };

      histories = await History.find(queryObject)
        .populate({
          path: "student",
          match: studentObject,
        })
        .sort("createdAt");
      histories = histories.filter((history) => history.student);

      // Initialize all dates
      const dateObject = {};
      eachDayOfInterval({
        start: startDate,
        end: endDate,
      }).forEach((date) => {
        const formattedDate = format(date, "EEEE");
        if (!dateObject.hasOwnProperty(formattedDate)) {
          dateObject[formattedDate] = 0;
        }
      });

      // update dates
      histories.forEach((history) => {
        const formattedDate = format(history.createdAt, "EEEE");
        dateObject[formattedDate] =
          dateObject[formattedDate] + history.pointsAdded;
      });

      histories = dateObject;
    }

    if (
      dateFilter === "thisMonth" ||
      dateFilter === "lastMonth" ||
      dateFilter === "twoMonthsAgo"
    ) {
      if (dateFilter === "thisMonth") {
        startDate = startOfMonth(today);
        endDate = endOfMonth(today);
      } else if (dateFilter === "lastMonth") {
        startDate = startOfMonth(subMonths(today, 1));
        endDate = endOfMonth(subMonths(today, 1));
      } else if (dateFilter === "twoMonthsAgo") {
        startDate = startOfMonth(subMonths(today, 2));
        endDate = endOfMonth(subMonths(today, 2));
      }

      queryObject.createdAt = { $gte: startDate, $lt: endDate };
      histories = await History.find(queryObject)
        .populate({
          path: "student",
          match: studentObject,
        })
        .sort("createdAt");
      histories = histories.filter((history) => history.student);

      // Initialize all dates
      const dateObject = {};
      eachDayOfInterval({
        start: startDate,
        end: endDate,
      }).forEach((date) => {
        const formattedDate = format(date, "MMM") + "-" + format(date, "d");
        if (!dateObject.hasOwnProperty(formattedDate)) {
          dateObject[formattedDate] = 0;
        }
      });

      // update dates
      histories.forEach((history) => {
        const formattedDate =
          format(history.createdAt, "MMM") +
          "-" +
          format(history.createdAt, "d");
        dateObject[formattedDate] =
          dateObject[formattedDate] + history.pointsAdded;
      });

      histories = dateObject;
    }

    if (dateFilter === "thisYear") {
      //todo : to copy to other date filter
      histories = await History.find(queryObject)
        .populate({
          path: "student",
          match: studentObject,
        })
        .sort("createdAt")
        .lean();
      histories = histories.filter((history) => history.student);

      console.log("historieeyyy", histories);
      //todo : to copy to other date filter

      startDate = histories[0].createdAt;
      endDate = histories[histories.length - 1].createdAt;
      // Initialize all dates
      const dateObject = {};
      eachDayOfInterval({
        start: startDate,
        end: endDate,
      }).forEach((date) => {
        const formattedDate = format(date, "MMM");
        if (!dateObject.hasOwnProperty(formattedDate)) {
          dateObject[formattedDate] = 0;
        }
      });

      // update dates
      histories.forEach((history) => {
        const formattedDate = format(history.createdAt, "MMM");
        dateObject[formattedDate] =
          dateObject[formattedDate] + history.pointsAdded;
      });

      histories = dateObject;
    }
  }

  res.status(200).json({ nbHits: histories.length, histories });
};

const getDashboardChart = async (req, res) => {
  const { chartType, dateFilter, batch, section, quarter } = req.query;

  const queryObject = {
    createdBy: new mongoose.Types.ObjectId(`${req.user}`),
  };
  const studentObject = {};

  if (!chartType) {
    throw new CustomError(400, "chartType is a required query params");
  }

  if (batch) {
    if (chartType === "barStudents") {
      queryObject.batch = batch;
    } else if (chartType === "barSections") {
      studentObject.batch = batch;
    }
  }

  if (section) {
    queryObject.section = section;
  }

  if (quarter) {
    queryObject.quarter = quarter;
  }
  // For barStudents
  if (dateFilter) {
    // Handle date filters
    let dateRange;
    const today = new Date();
    switch (dateFilter) {
      case "today":
        dateRange = {
          $gte: startOfDay(today),
          $lt: endOfDay(today),
        };
        break;
      case "thisWeek":
        dateRange = {
          $gte: startOfWeek(today),
          $lt: endOfWeek(today),
        };
        break;
      case "thisMonth":
        dateRange = {
          $gte: startOfMonth(today),
          $lt: endOfMonth(today),
        };
        break;
      default:
        dateRange = "";
    }

    queryObject.createdAt = dateRange;
  }

  let charts;
  // required query (chartType,batch,section)
  if (chartType === "barSections") {
    let histories = await History.aggregate([
      { $match: queryObject },
      {
        $addFields: {
          weekNumber: {
            $toInt: { $arrayElemAt: [{ $split: ["$week", "-"] }, 1] },
          },
        },
      },
      { $sort: { weekNumber: 1 } },
      {
        $lookup: {
          from: "students", // Collection to join with
          localField: "student", // Field in the histories collection
          foreignField: "_id", // Field in the students collection
          as: "student", // Name of the array field to add to the histories documents
        },
      },

      // Optional: Deconstruct the array field
      { $unwind: "$student" },
      {
        $match: { "student.batch": studentObject.batch }, // Match based on studentObject criteria
      },
    ]);

    // Function to prepare data
    const prepareChartData = (histories) => {
      const sections = [
        ...new Set(histories.map((item) => item.student.section)),
      ];
      const weeks = [...new Set(histories.map((item) => item.week))];

      const data = sections.map((section) => {
        return weeks.map((week) => {
          const sectionData = histories.filter(
            (item) => item.student.section === section && item.week === week
          );
          return sectionData.reduce(
            (total, item) => total + item.pointsAdded,
            0
          );
        });
      });

      return { sections, weeks, data };
    };
    const prepareChartDataAllQuarters = (histories) => {
      const sections = [
        ...new Set(histories.map((item) => item.student.section)),
      ];
      const quarters = [...new Set(histories.map((item) => item.quarter))];

      const data = sections.map((section) => {
        return quarters.map((quarter) => {
          const sectionData = histories.filter(
            (item) =>
              item.student.section === section && item.quarter === quarter
          );
          return sectionData.reduce(
            (total, item) => total + item.pointsAdded,
            0
          );
        });
      });

      return { sections, quarters, data };
    };

    if (quarter) {
      const { sections, weeks: labels, data } = prepareChartData(histories);
      charts = { sections, data, labels };
    } else {
      const {
        sections,
        quarters: labels,
        data,
      } = prepareChartDataAllQuarters(histories);
      charts = { sections, data, labels };
    }
  }

  // required query (chartType, batch, section, quarter)
  if (chartType === "barStudents") {
    let students = await Student.aggregate([
      { $match: queryObject },
      {
        $group: {
          _id: "$studentId",
          fullName: { $first: "$fullName" },
          lastName: { $first: "$lastName" },
          totalPoints: {
            $sum: { $add: ["$individualPoints", "$groupingsPoints"] },
          },
        },
      },
      { $sort: { lastName: 1 } },
    ]);

    const prepareChartData = (students) => {
      const names = students.map((student) => student.fullName);
      const data = students.map((student) => student.totalPoints);
      return { names, data };
    };
    const { names, data } = prepareChartData(students);
    charts = { names, data };
  }

  res.status(200).json({ nbHits: charts.length, charts });
};
module.exports = {
  getAllHistory,
  deleteAllHistory,
  addHistory,
  deleteHistory,
  getIndividualChart,
  getDashboardChart,
};
