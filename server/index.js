const express = require("express");
const connectDB = require("./db/connect");
const authRouter = require("./routes/auth");
const notFound = require("./middlewares/not-found");
const errorHandler = require("./middlewares/error-handler");
const studentRouter = require("./routes/students");
const authentication = require("./middlewares/authentication");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const weeksRouter = require("./routes/weeks");
const activityRouter = require("./routes/activities");
const historiesRouter = require("./routes/histories");
const actCollectionsRouter = require("./routes/actCollections");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// MIDDLEWARES for security
app.use(helmet());
app.use(mongoSanitize());
app.use(
  rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 300,
  })
);

// ROUTES
app.get("/", async (req, res) => {
  res.status(200).send("Hello from Sayap");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/students", authentication, studentRouter);
app.use("/api/v1/weeks", authentication, weeksRouter);
app.use("/api/v1/activities", authentication, activityRouter);
app.use("/api/v1/histories", authentication, historiesRouter);
app.use("/api/v1/actCollections", authentication, actCollectionsRouter);
app.post("/api/v1/loading", async (req, res) => {
  await new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, 3000)
  );

  res.status(200).send("upload completed");
});

app.use(notFound);
app.use(errorHandler);
// DB CONNECTION
const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log("Server Listening on Port " + port));
  } catch (error) {
    console.log("ERROR ON DB CONNECTION", error);
    process.exit(1);
  }
};

start();
