const config = require("../configs/config.js");
const userModel = require("../models/userModel.js");
const quoteModel = require("../models/quoteModel.js");
const sendMail = require("../utils/nodemailor.js");
const quoteEmailTemplate = require("../utils/quoteEmailTemplate.js");
const catchAsync = require("../utils/catchAsync.js");
const AppError = require("../utils/AppError.js");

// @access  Public
const createQuote = catchAsync(async (req, res, next) => {
  const adminUser = await userModel.findOne({ role: "admin" });
  if (!adminUser || !adminUser.isActive) {
    return next(new AppError("System is currently inactive. Please try again later.", 503));
  }

  const { username, email, service, budget, projectDescription } = req.body;

  if (!username || !email || !service || !budget || !projectDescription) {
    return next(new AppError("All fields are required", 400));
  }

  const quote = await quoteModel.create({
    username,
    email,
    service,
    budget,
    projectDescription,
  });

  if (!quote) {
    return next(new AppError("Something went wrong while saving the quote", 500));
  }

  // Quote save ho chuka hai, email fail ho to bhi client ko success milna chahiye
  try {
    await sendMail({
      to: config.ADMIN_EMAIL,
      subject: `New Quote Request from ${username}`,
      html: quoteEmailTemplate({
        username,
        email,
        service,
        budget,
        projectDescription,
      }),
      replyTo: email, // Reply dabane par seedha client ko jayega
    });
  } catch (err) {
    console.error("Quote email failed:", err.message);
  }

  return res.status(201).json({
    success: true,
    data: quote,
    message: "Quote request submitted successfully",
  });
});

// @access  Private/Admin and Users
const getAllQuotes = catchAsync(async (req, res, next) => {
  const quotes = await quoteModel.find().sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: quotes,
    message: "Quotes fetched successfully",
  });
});

// @access  Private/Admin
const updateQuoteStatus = catchAsync(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new AppError("Only admin can update quote status", 403));
  }

  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ["pending", "reviewed", "closed"];

  if (!allowedStatuses.includes(status)) {
    return next(new AppError("Invalid status value", 400));
  }

  const quote = await quoteModel.findByIdAndUpdate(
    id,
    { $set: { status } },
    { new: true },
  );

  if (!quote) {
    return next(new AppError("Quote not found", 404));
  }

  return res.status(200).json({
    success: true,
    data: quote,
    message: "Quote status updated successfully",
  });
});

// @access  Private/Admin
const deleteQuote = catchAsync(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new AppError("Only admin can delete quotes", 403));
  }

  const { id } = req.params;

  const quote = await quoteModel.findByIdAndDelete(id);

  if (!quote) {
    return next(new AppError("Quote not found", 404));
  }

  return res.status(200).json({
    success: true,
    data: {},
    message: "Quote deleted successfully",
  });
});

module.exports = { createQuote, getAllQuotes, updateQuoteStatus, deleteQuote };