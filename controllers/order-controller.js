import { stripePkg } from "../index.js";
import Gift from "../models/gift.js";
import Order from "../models/order.js";
import User from "../models/user.js";
// import User from "../models/user.js";
import { AppError } from "../utils/AppMiddleware.js";
import { catchAsync } from "../utils/catchAsync.js";

// import{ filterKeys } from "../utils/filterFunction.js";

export const GETCHECKOUTSESSION = catchAsync(async (req, res, next) => {
  //get gift
  const order = await Order.findById(req.order.id);
  const user = await User.findById(req.user.id);

  const orderData = order.order.map((item) => ({
    price_data: {
      currency: "kes",
      product_data: {
        name: item.gift.name, // Use item.gift instead of gift
        description: item.gift.description.text.split(",")[0],
        images: [item.gift.image],
      },
      unit_amount: item.gift.price * 100,
    },
    quantity: item.quantity,
  }));

  //TODO:CREATE F/E  SUCCESS AND CANCEL URLS
  const session = await stripePkg.checkout.sessions.create({
    line_items: orderData,
    success_url: `${req.protocol}://${req.get("host")}/user/${user._id}/order/`,
    cancel_url: `${req.protocol}://${req.get("host")}/gift`,
    customer_email: user.email,
    client_reference_id: req.params.giftId,
    payment_method_types: ["card"],
    mode: "payment",
  });

  res.redirect(303, session.url);
});

export const CREATEORDER = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { order, totalPrice } = req.body;

  if (!order || !totalPrice) {
    return next(new AppError("Bad Request Missing  parameters", 400));
  }

  for (const item of order) {
    const gift = await Gift.findById(item.gift);

    if (!gift) {
      return next(new AppError("Gift not found", 404));
    }

    if (item.quantity > gift.countInStock) {
      return next(
        new AppError("Not enough stock for the requested quantity", 400)
      );
    }

    gift.countInStock -= item.quantity;
    // console.log(`Gift countInStock after: ${gift.countInStock}`);
    await gift.save();
  }

  const newOrder = await Order.create({
    user: userId,
    ...req.body,
  });

  req.order = { id: newOrder._id };

  next();
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
