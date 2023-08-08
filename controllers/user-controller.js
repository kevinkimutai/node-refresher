import User from "../models/user.js";
import { AppError } from "../utils/AppMiddleware.js";
import { catchAsync } from "../utils/catchAsync.js";
import { filterKeys } from "../utils/filterFunction.js";

export const UPDATEME = catchAsync(async (req, res, next) => {
  if (req.body.password) {
    return next(AppError("use /reset-passeword to change password", 400));
  }

  //You can only change fullname and email values
  const filtered = filterKeys(req.body, ["fullname", "email"]);

  console.log("FILTERED", filtered);

  const user = await User.findByIdAndUpdate(req.user.id, filtered, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: user,
  });
});

export const DELETEME = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
  });
});

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

export const GETME = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;

  next();
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

  //Admin can only change roles of users
  const filtered = filterKeys(req.body, ["role"]);

  const user = await User.findByIdAndUpdate(id, filtered, {
    new: true,
    runValidators: true,
  });

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
