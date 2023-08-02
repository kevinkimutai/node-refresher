import Gift from "../models/gift.js";
import { AppError } from "../utils/AppMiddleware.js";
import { catchAsync } from "../utils/catchAsync.js";

export const GETALLGIFTS = catchAsync(async (req, res, next) => {
  const gifts = await Gift.find();

  res.status(200).json({
    status: "success",
    items: gifts.length,
    data: {
      gifts,
    },
  });
});

export const GETGIFT = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Bad Request Missing Id parameter", 400));
  }
  const gift = await Gift.findById(id);
  if (!gift) {
    return next(new AppError("No Gift with that id", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      gift,
    },
  });
});

export const CREATEGIFT = catchAsync(async (req, res, next) => {
  const gifts = await Gift.create(req.body);

  res.status(201).json({
    status: "success",
    items: gifts.length,
    data: {
      gifts,
    },
  });
});

export const UPDATEGIFT = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Bad Request Missing Id parameter", 400));
  }

  const gift = await Gift.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    status: "success",
    items: gifts.length,
    data: {
      gift,
    },
  });
});

export const DELETEGIFT = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Bad Request Missing Id parameter", 400));
  }
  const gift = await Gift.findById(id);
  if (!gift) {
    return next(new AppError("No Gift with that id", 404));
  }

  res.status(204).json({
    status: "success",
  });
});

//id params
