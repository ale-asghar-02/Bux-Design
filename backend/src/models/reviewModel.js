const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
    },
    token: {
      token: { type: String, unique: true, sparse: true },
      used: { type: Boolean, default: false },
      expiresAt: { type: Date },
    },
    name: {
      type: String,
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    image: {
      type: String,
    },
    field: {
      type: String,
      trim: true,
      maxlength: [50, "Field cannot exceed 50 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    rating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "approved", "rejected"],
        message: "Status must be pending, approved, or rejected",
      },
      default: "pending",
    },
  },
  { timestamps: true }
);

const review = mongoose.model("reviews", reviewSchema);
module.exports = review;