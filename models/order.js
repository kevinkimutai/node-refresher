import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    order: [
      {
        gift: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Gift",
        },

        quantity: {
          type: Number,
          min: [1, "Order must be greater than one"],
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: [true, "Missing totalPrice field in user schema"],
    },
    status: {
      type: String,
      default: "pending",
      required: [true, "Missing status field in order schema"],
    },
  },
  { timestamps: true }
);

//pre populate method
orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select:
      "-role -active -resetToken -resetTokenExpires -createdAt -updatedAt",
  });

  this.populate({
    path: "order.gift",
    select: "-countInStock -createdAt -updatedAt",
  });

  next();
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
