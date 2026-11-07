const crypto = require("crypto");
const config = require("../configs/config");
const reviewModel = require("../models/reviewModel");
const cloudinary = require("../utils/cloudinary");
const sendMail = require("../utils/nodemailor");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

// Helper - Cloudinary se image delete karo
const deleteFromCloudinary = (imgUrl) => {
  const publicId = imgUrl.split("/").slice(-2).join("/").split(".")[0];
  return cloudinary.uploader.destroy(publicId);
};

// @access  Private/Admin
const generateReviewLink = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("Email is required", 400));
  }

  // Agar pehle se pending review hai toh dobara mat bhejo
  const existing = await reviewModel.findOne({
    email,
    "token.used": false,
    "token.expiresAt": { $gt: new Date() },
  });

  if (existing) {
    return next(
      new AppError("A review link has already been sent to this email", 400),
    );
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const newReview = await reviewModel.create({
    email,
    token: {
      token,
      used: false,
      expiresAt,
    },
  });

  const reviewLink = `${config.FRONTEND_URL}/review/${token}`;

  try {
    await sendMail({
      to: email,
      subject: "You're invited to leave a review",
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Share Your Experience</h2>
                <p>You've been invited to leave a review. Click the button below to share your feedback.</p>
                <a href="${reviewLink}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px; margin: 16px 0;">
                    Leave a Review
                </a>
                <p style="color: #888; font-size: 13px;">This link will expire in 7 days.</p>
            </div>
        `,
    });
  } catch (err) {
    // Email nahi gayi to record delete kar do, warna dobara link bhejne par
    // "already sent" ka error aata rahega
    await reviewModel.findByIdAndDelete(newReview._id);
    console.error("Review email failed:", err.message);
    return next(
      new AppError("Failed to send review email. Please try again.", 500),
    );
  }

  return res.status(200).json({
    success: true,
    message: "Review link sent successfully",
  });
});

// @access  Public
const submitReview = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { name, field, description, rating } = req.body;

  const review = await reviewModel.findOne({ "token.token": token });

  if (!review) {
    return next(new AppError("Invalid review link", 404));
  }

  if (review.token.used) {
    return next(new AppError("This review link has already been used", 400));
  }

  if (review.token.expiresAt < new Date()) {
    return next(new AppError("This review link has expired", 400));
  }

  if (!name || !field || !description || !rating) {
    return next(new AppError("All fields are required", 400));
  }

  let imageUrl = null;
  if (req.file) {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "reviews",
    });
    imageUrl = result.secure_url;
  }

  review.name = name;
  review.field = field;
  review.description = description;
  review.rating = Number(rating);
  review.image = imageUrl;
  review.status = "pending";
  review.token.used = true;

  await review.save();

  return res.status(200).json({
    success: true,
    message: "Review submitted successfully",
  });
});

// @access  Private/Admin
const getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await reviewModel.find().sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: reviews,
    message: "Reviews fetched successfully",
  });
});

// @access  Public
const getApprovedReviews = catchAsync(async (req, res, next) => {
  const reviews = await reviewModel
    .find({ status: "approved" })
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: reviews,
    message: "Approved reviews fetched successfully",
  });
});

// @access  Private/Admin
const updateReviewStatus = catchAsync(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new AppError("Only admin can update review status", 403));
  }

  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return next(new AppError("Status must be approved or rejected", 400));
  }

  const review = await reviewModel.findByIdAndUpdate(
    id,
    { status },
    { new: true },
  );

  if (!review) {
    return next(new AppError("Review not found", 404));
  }

  return res.status(200).json({
    success: true,
    data: review,
    message: `Review ${status} successfully`,
  });
});

// @access  Private/Admin
const deleteReview = catchAsync(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new AppError("Only admin can delete review status", 403));
  }

  const { id } = req.params;

  const review = await reviewModel.findById(id);

  if (!review) {
    return next(new AppError("Review not found", 404));
  }

  if (review.image) {
    await deleteFromCloudinary(review.image);
  }

  await reviewModel.findByIdAndDelete(id);

  return res.status(200).json({
    success: true,
    data: {},
    message: "Review deleted successfully",
  });
});

module.exports = {
  generateReviewLink,
  submitReview,
  getAllReviews,
  getApprovedReviews,
  updateReviewStatus,
  deleteReview,
};