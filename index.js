import express from "express";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import helmet from "helmet";

import giftRouter from "./routes/gift-routes.js";
import authRouter from "./routes/auth-routes.js";
import userRouter from "./routes/user-routes.js";
import orderRouter from "./routes/order-routes.js";
import reviewRouter from "./routes/review-routes.js";

import dbConnect from "./db/dbConnect.js";
import { errorHandler } from "./controllers/error-controller.js";

dotenv.config();

const app = express();

//Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

//Logger
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

//Xss Attacks Helmet
app.use(helmet());

//body parser middleware
app.use(express.json());
app.use("/api", limiter);

//routes
app.use("/api/v1/gifts", giftRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/reviews", reviewRouter);

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
