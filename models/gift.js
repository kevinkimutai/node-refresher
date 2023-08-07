import mongoose from "mongoose";

const giftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "missing name field in gift schema"],
    },
    description: {
      text: {
        type: String,
        required: [true, "missing  description text in gift schema"],
      },
      features: {
        type: [String],
        required: [true, "missing features field in gift schema"],
      },
    },
    price: {
      type: Number,
      required: [true, "missing price field in gift schema"],
    },
    category: {
      type: String,
      required: [true, "missing category field in gift schema"],
    },
    image: {
      type: String,
      required: [true, "missing image field in gift schema"],
    },

    numOrders: {
      type: Number,

      min: 0,
    },
    countInStock: {
      type: Number,
      required: [true, "missing stock number field in gift schema"],
      min: 1,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { timestamps: true }
);

//indexing
giftSchema.index({
  name: "text",
  category: "text",
  "description.text": "text",
});

// Virtual populate
giftSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "gift",
  localField: "_id",
});

const Gift = mongoose.model("Gift", giftSchema);

export default Gift;
