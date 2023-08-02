import User from "../models/user.js";
import { AppError } from "../utils/AppMiddleware.js";
import { catchAsync } from "../utils/catchAsync.js";
import { generateToken } from "../utils/generateToken.js";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

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

  //check if user still exists
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new AppError("Unauthorised!No user with such token!!", 401));
  }

  req.user = { id: decoded.id, role: decoded.role };

  next();
});

export const RESTRICTEDROUTE = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("USER", req.user);

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError("Forbidden,Login with proper rights", 403));
    }

    next();
  };
};

export const FORGOTPASSWORD = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("missing email field", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("No user with that email found", 404));
  }

  //Generate resetToken
  const resetToken = user.generateResetToken();
  await user.save();

  //Send token via email

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}.api/v1/auth/reset-password/${resetToken}`;

  const emailMsg = `Successful,Follow the link below to reset your password. ${resetURL}.This Link expires in 10 minutes.If it was not You report customer@giftr.com`;

  const emailOptions = {
    email: user.email,
    subject: "Password Recovery",
    message: emailMsg,
  };

  try {
    await sendEmail(emailOptions);
    res.status(200).json({ status: "success" });
  } catch (error) {
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    await user.save();

    next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

export const RESETPASSWORD = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token) {
    return next(new AppError("missing token params", 400));
  }

  const hashedToken = crypto.createHash("SHA256").update(token).digest("hex");

  //getUser
  const user = await User.findOne({ resetToken: hashedToken });

  if (!user || user.resetTokenExpires < Date.now()) {
    return next(new AppError("Unauthorised! Invalid/Expired token", 401));
  }

  user.password = password;
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;

  await user.save();

  res.status(200).json({
    status: "success",
  });
});

export const UPDATEPASSWORD = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const { password } = req.body;

  const user = await User.findById(id);

  if (!user) {
    return next(new AppError("unauthorized,Log in", 401));
  }

  user.password = password;
  await user.save();

  res.status(200).json({ status: "success" });
});
