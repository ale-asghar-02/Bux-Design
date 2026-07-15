const blogModel = require("../models/blogModel.js");
const cloudinary = require("../utils/cloudinary.js");
const catchAsync = require("../utils/catchAsync.js");
const AppError = require("../utils/AppError.js");

// @access  Private (any logged-in user)
const createBlog = catchAsync(async (req, res, next) => {
  const { title } = req.body;

  if (!title) {
    return next(new AppError("title is required", 400));
  }

  if (!req.file) {
    return next(new AppError("Image is required", 400));
  }

  const b64 = Buffer.from(req.file.buffer).toString("base64");
  const dataURI = `data:${req.file.mimetype};base64,${b64}`;
  const result = await cloudinary.uploader.upload(dataURI, {
    folder: "blogs",
  });

  const blog = await blogModel.create({
    owner: req.user.id,
    title,
    blogImage: result.secure_url,
  });

  return res.status(201).json({
    success: true,
    data: blog,
    message: "Blog created successfully",
  });
});

// @access  Public
const getAllBlogs = catchAsync(async (req, res, next) => {
  const blogs = await blogModel
    .find()
    .populate("owner", "username email")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: blogs,
    message: "Blogs fetched successfully",
  });
});

// @access  Private (sirf logged-in user apne blogs dekhe)
const getMyBlogs = catchAsync(async (req, res, next) => {
  const blogs = await blogModel
    .find({ owner: req.user.id })
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: blogs,
    message: "Your blogs fetched successfully",
  });
});

// @access  Private (sirf owner apna blog update kare)
const updateBlog = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body;

  const blog = await blogModel.findById(id);

  if (!blog) {
    return next(new AppError("Blog not found", 404));
  }

  // ownership check
  if (blog.owner.toString() !== req.user.id) {
    return next(
      new AppError("You are not authorized to update this blog", 403),
    );
  }

  if (title) blog.title = title;

  if (req.file) {
    // purani image cloudinary se delete kar dein (optional but recommended)
    if (blog.blogImage) {
      const publicId = blog.blogImage
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "blogs",
    });
    blog.blogImage = result.secure_url;
  }

  await blog.save();

  return res.status(200).json({
    success: true,
    data: blog,
    message: "Blog updated successfully",
  });
});

// @access  Private (sirf owner and admin both blog delete kare)
const deleteBlog = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const blog = await blogModel.findById(id);

  if (!blog) {
    return next(new AppError("Blog not found", 404));
  }

  // ownership check - owner ya admin dono allowed
  const isOwner = blog.owner.toString() === req.user.id;
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return next(
      new AppError("You are not authorized to delete this blog", 403),
    );
  }

  // cloudinary se image bhi delete kar dein
  if (blog.blogImage) {
    const publicId = blog.blogImage
      .split("/")
      .slice(-2)
      .join("/")
      .split(".")[0];
    await cloudinary.uploader.destroy(publicId);
  }

  await blogModel.findByIdAndDelete(id);

  return res.status(200).json({
    success: true,
    data: {},
    message: "Blog deleted successfully",
  });
});

module.exports = { createBlog, getAllBlogs, getMyBlogs, updateBlog, deleteBlog };