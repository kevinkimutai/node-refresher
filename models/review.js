import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    gift: { type: mongoose.Schema.Types.ObjectId, ref: "Gift" },
    rating: { type: Number, min: 1, max: 5 },
    review: {
      type: String,
      minLength: [10, "review shuld be more than 10 characters"],
      required: [true, "Missing review text in schema"],
    },
  },
  { timestamps: true }
);

//pre populate method
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select:
      "-role -active -resetToken -resetTokenExpires -createdAt -updatedAt",
  });

  this.populate({
    path: "gift",
    select: "-description -image -countInStock -createdAt -updatedAt",
  });

  next();
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
