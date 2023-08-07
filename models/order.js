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
    select: "-description -image -countInStock -createdAt -updatedAt",
  });

  next();
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
