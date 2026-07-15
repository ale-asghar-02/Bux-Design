const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    images: {
      type: [String],
      required: true,
    },
    subTitle: {
      type: String,
      required: [true, "Subtitle is required"],
      trim: true,
      maxlength: [30, "Subtitle cannot exceed 30 characters"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [400, "Description cannot exceed 400 characters"],
    },
    field: {
      type: String,
      required: [true, "Field is required"],
      enum: {
        values: ["Website", "Mobile-app", "Featured"],
        message: "Field must be either Website, Mobile-app, or Featured",
      },
    },
  },
  { timestamps: true },
);

const portfolio = mongoose.model("portfolio", portfolioSchema);
module.exports = portfolio;
