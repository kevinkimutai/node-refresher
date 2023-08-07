import Order from "../models/order.js";
// import User from "../models/user.js";
import { AppError } from "../utils/AppMiddleware.js";
import { catchAsync } from "../utils/catchAsync.js";
// import { filterKeys } from "../utils/filterFunction.js";

export const CREATEORDER = catchAsync(async (req, res, next) => {
  const order = await Order.create(req.body);

  res.status(201).json({
    status: "success",
    items: order.length,
    data: {
      order,
    },
  });
});

export const GETALLORDERS = catchAsync(async (req, res, next) => {
  const order = await Order.find();

  res.status(200).json({
    status: "success",
    items: order.length,
    data: {
      order,
    },
  });
});

export const GETORDER = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Bad Request Missing Id parameter", 400));
  }
  const order = await Order.findById(id);
  if (!order) {
    return next(new AppError("No order with that id", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

export const UPDATEORDER = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Bad Request Missing Id parameter", 400));
  }

  //Admin can only change roles of users
  //   const filtered = filterKeys(req.body, ["role"]);
  //TODO: ADD VALUES WHICHA CAN ONLY BE CHANGED
  const order = await Order.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!order) {
    return next(new AppError("No Order with that id", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

export const DELETEORDER = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Bad Request Missing Id parameter", 400));
  }
  const order = await Order.findByIdAndDelete(id);
  if (!order) {
    return next(new AppError("No Order with that id", 404));
  }

  res.status(204).json({
    status: "success",
  });
});

//id params
