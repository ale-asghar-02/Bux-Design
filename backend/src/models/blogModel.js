const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [80, "Title cannot exceed 80 characters"],
    },
    blogImage: {
      type: String,
      required: [true, "Image is required"],
    },
  },
  { timestamps: true },
);

const blog = mongoose.model("Blog", blogSchema);
module.exports = blog;