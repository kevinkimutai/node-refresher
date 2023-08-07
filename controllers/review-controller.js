// import Order from "../models/order.js";
import Review from "../models/review.js";
// import User from "../models/user.js";
import { AppError } from "../utils/AppMiddleware.js";
import { catchAsync } from "../utils/catchAsync.js";
// import { filterKeys } from "../utils/filterFunction.js";

export const CREATEREVIEW = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const giftId = req.params.giftId;

  const review = await Review.create({
    user: userId,
    gift: giftId,
    ...req.body,
  });

  res.status(201).json({
    status: "success",
    items: review.length,
    data: {
      review,
    },
  });
});

export const GETALLREVIEWS = catchAsync(async (req, res, next) => {
  let filter = {};

  if (req.params.giftId) {
    filter = { gift: req.params.giftId };
  }

  const review = await Review.find(filter);

  res.status(200).json({
    status: "success",
    items: review.length,
    data: {
      review,
    },
  });
});

export const GETREVIEW = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Bad Request Missing Id parameter", 400));
  }
  const review = await Review.findById(id);
  if (!review) {
    return next(new AppError("No order with that id", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      review,
    },
  });
});

export const UPDATEREVIEW = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Bad Request Missing Id parameter", 400));
  }

  //Admin can only change roles of users
  //   const filtered = filterKeys(req.body, ["role"]);
  //TODO: ADD VALUES WHICHA CAN ONLY BE CHANGED
  const review = await Review.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!review) {
    return next(new AppError("No Order with that id", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      review,
    },
  });
});

export const DELETEREVIEW = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Bad Request Missing Id parameter", 400));
  }
  const review = await Review.findByIdAndDelete(id);
  if (!review) {
    return next(new AppError("No Order with that id", 404));
  }

  res.status(204).json({
    status: "success",
  });
});

//id params
