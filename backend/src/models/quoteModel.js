const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      minlength: [3, "Username must be at least 3 characters long"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    service: {
      type: String,
      required: [true, "Service is required"],
      enum: [
        "Redesign my app or website",
        "Hiring a dedicated UX/UI Designer",
        "Clickable Design Prototype",
        "Other",
        "Design A complete Product from scratch",
      ],
    },
    budget: {
      type: String,
      required: [true, "Budget is required"],
      enum: ["less 1k", "2k-5k", "5k-10k", "cannot say"],
    },
    projectDescription: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "closed"],
      default: "pending"
    }
  },
  { timestamps: true },
);

const quote = mongoose.model("quotes", quoteSchema);
module.exports = quote;