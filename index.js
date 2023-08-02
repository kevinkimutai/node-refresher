import express from "express";
import dotenv from "dotenv";

import giftRouter from "./routes/gift-routes.js";
import authRouter from "./routes/auth-routes.js";
import userRouter from "./routes/user-routes.js";

import dbConnect from "./db/dbConnect.js";
import { errorHandler } from "./controllers/error-controller.js";

dotenv.config();

const app = express();

//body parser middleware
app.use(express.json());

//routes
app.use("/api/v1/gifts", giftRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

//error middleware
app.use(errorHandler);

//connect DB
dbConnect();

//start server
const server = app.listen(
  process.env.PORT,
  console.log(`APP running,Listening on port ${process.env.PORT}`)
);

//unhandled Rejection
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION!");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
