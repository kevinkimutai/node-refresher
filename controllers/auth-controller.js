import User from "../models/user.js";
import { AppError } from "../utils/AppMiddleware.js";
import { catchAsync } from "../utils/catchAsync.js";
import { generateToken } from "../utils/generateToken.js";
import { promisify } from "util";
import jwt from "jsonwebtoken";

export const SIGNUP = catchAsync(async (req, res, next) => {
  const { fullname, email, password } = req.body;

  const user = await User.create({ fullname, email, password });

  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

export const LOGIN = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("missing password or email field", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePasswords(password, user.password))) {
    return next(new AppError("Wrong email or password", 401));
  }

  const accessToken = generateToken(user._id, user.role);

  res.status(200).json({
    status: "success",
    token: accessToken,
  });
});

export const AUTHPROTECTED = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Unauthorised.Please Log in", 401));
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_ACCESS_TOKEN_JWT
  );

  console.log("TOKEN", decoded);

  //check if user still exists
  const user = await User.findById(decode.id);

  if (!user) {
    return next(new AppError("Unauthorised!No user with such token!!", 401));
  }

  // req.user = decoded;

  next();
});
