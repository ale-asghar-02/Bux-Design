const portfolioModel = require("../models/portfolioModel.js");
const cloudinary = require("../utils/cloudinary.js");
const catchAsync = require("../utils/catchAsync.js");
const AppError = require("../utils/AppError.js");

const uploadToCloudinary = async (file) => {
  const b64 = Buffer.from(file.buffer).toString("base64");
  const dataURI = `data:${file.mimetype};base64,${b64}`;
  const result = await cloudinary.uploader.upload(dataURI, {
    folder: "portfolio",
  });
  return result.secure_url;
};

// @access  Private (any logged-in user)
const createPortfolio = catchAsync(async (req, res, next) => {
  const { subTitle, title, description, field } = req.body;

  if (!req.files || req.files.length === 0) {
    return next(new AppError("At least one image is required", 400));
  }

  const uploadedImages = await Promise.all(
    req.files.map((file) => uploadToCloudinary(file)),
  );

  const portfolio = await portfolioModel.create({
    owner: req.user.id,
    images: uploadedImages,
    subTitle,
    title,
    description,
    field,
  });

  return res.status(201).json({
    success: true,
    data: portfolio,
    message: "Portfolio created successfully",
  });
});

// @access  Public
const getAllPortfolios = catchAsync(async (req, res, next) => {
  const portfolios = await portfolioModel
    .find()
    .populate("owner", "username email")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: portfolios,
    message: "Portfolios fetched successfully",
  });
});

// @access  Private (sirf logged-in user apne portfolios dekhe)
const getMyPortfolios = catchAsync(async (req, res, next) => {
  const portfolios = await portfolioModel
    .find({ owner: req.user.id })
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: portfolios,
    message: "Your portfolios fetched successfully",
  });
});

// @access  Private (sirf owner apna portfolio update kare)
const updatePortfolio = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { subTitle, title, description, field } = req.body;

  const portfolio = await portfolioModel.findById(id);

  if (!portfolio) {
    return next(new AppError("Portfolio not found", 404));
  }

  // ownership check
  if (portfolio.owner.toString() !== req.user.id) {
    return next(
      new AppError("You are not authorized to update this portfolio", 403),
    );
  }

  if (subTitle) portfolio.subTitle = subTitle;
  if (title) portfolio.title = title;
  if (description) portfolio.description = description;
  if (field) portfolio.field = field;

  let existingImages = portfolio.images;
  if (req.body.existingImages) {
    existingImages = JSON.parse(req.body.existingImages);
  }

  let uploadedImages = [];
  if (req.files && req.files.length > 0) {
    uploadedImages = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file)),
    );
  }

  const finalImages = [...existingImages, ...uploadedImages];

  if (finalImages.length === 0) {
    return next(new AppError("At least one image is required", 400));
  }

  // jo images remove hui hain unko cloudinary se bhi delete kar dein
  const removedImages = portfolio.images.filter(
    (img) => !existingImages.includes(img),
  );
  await Promise.all(
    removedImages.map((imgUrl) => {
      const publicId = imgUrl.split("/").slice(-2).join("/").split(".")[0];
      return cloudinary.uploader.destroy(publicId);
    }),
  );

  portfolio.images = finalImages;

  await portfolio.save();

  return res.status(200).json({
    success: true,
    data: portfolio,
    message: "Portfolio updated successfully",
  });
});

// @access  Private (sirf owner and admin both portfolio delete kare)
const deletePortfolio = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const portfolio = await portfolioModel.findById(id);

  if (!portfolio) {
    return next(new AppError("Portfolio not found", 404));
  }

  // ownership check - owner khud delete kare, ya admin kisi ka bhi delete kar sake
  const isOwner = portfolio.owner.toString() === req.user.id;
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return next(
      new AppError("You are not authorized to delete this portfolio", 403),
    );
  }

  await Promise.all(
    portfolio.images.map((imgUrl) => {
      const publicId = imgUrl.split("/").slice(-2).join("/").split(".")[0];
      return cloudinary.uploader.destroy(publicId);
    }),
  );

  await portfolioModel.findByIdAndDelete(id);

  return res.status(200).json({
    success: true,
    data: {},
    message: "Portfolio deleted successfully",
  });
});

module.exports = { createPortfolio, getAllPortfolios, getMyPortfolios, updatePortfolio, deletePortfolio };