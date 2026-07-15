const config = require("../configs/config");
const userModel = require('../models/userModel');
const blogModel = require('../models/blogModel');
const portfolioModel = require('../models/portfolioModel');
const sessionModel = require('../models/sessionModel');
const transporter = require("../utils/nodemailor");
const cloudinary = require('../utils/cloudinary');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const getMe = catchAsync(async (req, res, next) => {
    const user = req.user.id;
    if (!user) {
        return next(new AppError('Unauthorized', 401));
    }

    const userData = await userModel.findById(user).select('-password');
    res.status(200).json({
            message : 'User data retrieved successfully',
            data : userData
    });
});

const updateProfile = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { username, emailAddress, linkedIn, dribbble, behance, pinterest } = req.body;

    const updateFields = {};
    if (username)     updateFields.username     = username;
    if (emailAddress !== undefined) updateFields.emailAddress = emailAddress;
    if (linkedIn !== undefined)     updateFields.linkedIn     = linkedIn;
    if (dribbble !== undefined)     updateFields.dribbble     = dribbble;
    if (behance !== undefined)      updateFields.behance      = behance;
    if (pinterest !== undefined)    updateFields.pinterest    = pinterest;

    if (req.file) {
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'interview-ai/profiles'
        });
        updateFields.userImage = result.secure_url;
    }

    const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { $set: updateFields },
        { new: true }
    ).select('-password');

    res.status(200).json({
        message: 'Profile updated successfully',
        user: updatedUser
    });
});

const getPublicProfile = catchAsync(async (req, res, next) => {
    const admin = await userModel.findOne({ role: "admin" }).select("email linkedIn dribbble behance pinterest")

    if (!admin) {
        return next(new AppError("Profile not found", 404));
    }

    res.status(200).json(admin);
});

const deleteAccount = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const user = await userModel.findById(userId);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  await sessionModel.deleteMany({ user: user._id });
  await userModel.findByIdAndDelete(userId);

  transporter.sendMail({
    from: `"Bux Design" <${config.EMAIL_USER}>`,
    to: user.email,
    subject: "Your Account Has Been Deleted",
    html: `
            <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:12px;">
                <h2 style="color:#1e293b;margin-bottom:8px;">Account Deleted</h2>
                <p style="color:#475569;font-size:15px;">
                    Hi ${user.username}, your account and all associated data have been permanently deleted as requested.
                </p>
                <p style="color:#64748b;font-size:13px;">
                    If you did not request this, please contact our support team immediately.
                </p>
                <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
                <p style="color:#94a3b8;font-size:12px;text-align:center;">
                    &copy; ${new Date().getFullYear()} Bux Design. All rights reserved.
                </p>
            </div>
        `,
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.clearCookie("gateToken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.status(200).json({
    message: "Your account has been deleted successfully",
  });
});

// @access  Private (only Admin Handleing)
const getAllMembers = catchAsync(async (req, res, next) => {
    const users = await userModel.aggregate([
        {
            $lookup: {
                from: 'blogs', // collection name (usually lowercase plural of model)
                localField: '_id',
                foreignField: 'owner',
                as: 'blogs'
            }
        },
        {
            $lookup: {
                from: 'portfolios', // collection name
                localField: '_id',
                foreignField: 'owner',
                as: 'portfolios'
            }
        },
        {
            $addFields: {
                blogCount: { $size: '$blogs' },
                portfolioCount: { $size: '$portfolios' }
            }
        },
        {
            $project: {
                password: 0,
                blogs: 0,      // full array nahi chahiye, sirf count
                portfolios: 0
            }
        }
    ]);

    res.status(200).json({
        message: 'Members data retrieved successfully',
        members: users
    });
});

// @access  Private (only Admin Handleing)
const toggleStatus = catchAsync(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  user.isActive = !user.isActive;
  await user.save();
  return res.status(200).json({
    success: true,
    isActive: user.isActive,
    message: `System ${user.isActive ? "activated" : "deactivated"} successfully`,
  });
});

// @access  Private (only Admin Handleing)
const deleteUserByAdmin = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await userModel.findById(id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Admin khud ko is route se delete na kar sake (optional safety)
  if (user._id.toString() === req.user.id.toString()) {
    return next(
      new AppError("Use /delete-account to delete your own account", 400)
    );
  }

  await sessionModel.deleteMany({ user: user._id });
  await userModel.findByIdAndDelete(id);

  transporter.sendMail({
    from: `"Bux Design" <${config.EMAIL_USER}>`,
    to: user.email,
    subject: "Your Account Has Been Deleted",
    html: `
            <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:12px;">
                <h2 style="color:#1e293b;margin-bottom:8px;">Account Deleted</h2>
                <p style="color:#475569;font-size:15px;">
                    Hi ${user.username}, your account and all associated data have been permanently deleted by an administrator.
                </p>
                <p style="color:#64748b;font-size:13px;">
                    If you believe this was done in error, please contact our support team.
                </p>
                <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
                <p style="color:#94a3b8;font-size:12px;text-align:center;">
                    &copy; ${new Date().getFullYear()} Bux Design. All rights reserved.
                </p>
            </div>
        `,
  });

  res.status(200).json({
    message: "User deleted successfully by admin",
  });
});

module.exports = { getMe, updateProfile, getPublicProfile, deleteAccount, getAllMembers, toggleStatus, deleteUserByAdmin };