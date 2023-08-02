import User from "../models/user.js";
import { AppError } from "../utils/AppMiddleware.js";
import { catchAsync } from "../utils/catchAsync.js";

export const GETALLUSERS = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    items: users.length,
    data: {
      users,
    },
  });
});

export const GETUSER = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Bad Request Missing Id parameter", 400));
  }
  const user = await User.findById(id);
  if (!user) {
    return next(new AppError("No user with that id", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

export const UPDATEUSER = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Bad Request Missing Id parameter", 400));
  }

    const user = await User.findByIdAndUpdate(id, req.body);
    
  if (!user) {
    return next(new AppError("No user with that id", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

export const DELETEUSER = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Bad Request Missing Id parameter", 400));
  }
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return next(new AppError("No user with that id", 404));
  }

  res.status(204).json({
    status: "success",
  });
});

//id params
