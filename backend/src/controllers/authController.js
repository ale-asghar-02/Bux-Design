const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const config = require("../configs/config");
const userModel = require("../models/userModel");
const sessionModel = require("../models/sessionModel");
const sendMail = require("../utils/nodemailor");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const userRegister = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(new AppError("All fields are required", 400));
  }

  const normalizedEmail = email.trim().toLowerCase();

  const userExists = await userModel.findOne({ email: normalizedEmail });
  if (userExists) {
    return next(new AppError("User already exists", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await new userModel({
    username,
    email: normalizedEmail,
    password: hashedPassword,
  });
  await newUser.save();

  // Email fail ho to bhi registration chalni chahiye
  try {
    await sendMail({
      to: newUser.email,
      subject: "Welcome to Bux Design 🎉",
      html: `
            <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px; background:#f8fafc;border-radius:12px;">
                <h2 style="color:#1e293b;margin-bottom:8px;">Welcome, ${newUser.username}!</h2>
                <p style="color:#475569;font-size:15px;">
                    Thank you for creating an account with us. We're excited to have you on board.
                </p>
                <p style="color:#475569;font-size:15px;">
                    You can now log in and start exploring your dashboard.
                </p>
                <a href="${config.FRONTEND_URL}" style="
                    display:inline-block;padding:12px 28px;margin:20px 0;
                    background:#4f46e5;color:#ffffff;
                    border-radius:8px;text-decoration:none;
                    font-weight:bold;font-size:15px;
                ">Click Here</a>
                <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
                <p style="color:#94a3b8;font-size:12px;text-align:center;">
                    &copy; ${new Date().getFullYear()} Bux Design. All rights reserved.
                </p>
            </div>
        `,
    });
  } catch (err) {
    console.error("Welcome email failed:", err.message);
  }

  const refreshToken = jwt.sign({ id: newUser._id }, config.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const refreshTokenHash = await crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await new sessionModel({
    user: newUser._id,
    refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });
  await session.save();

  const accessToken = jwt.sign(
    {
      id: newUser._id,
      sessionId: session._id,
    },
    config.JWT_SECRET,
    { expiresIn: "15m" },
  );

  res.clearCookie("gateToken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.status(201).json({
    message: "User registered successfully",
    user: {
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.createdAt,
      isActive: newUser.isActive,
    },
    accessToken,
  });
});

const userLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("All fields are required", 400));
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await userModel.findOne({ email: normalizedEmail });
  if (!user) {
    return next(new AppError("Invalid credentials", 400));
  }

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    return next(new AppError("Invalid credentials", 400));
  }

  const refreshToken = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "7d",
  });

  const refreshTokenHash = await crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
  const session = await new sessionModel({
    user: user._id,
    refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });
  await session.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const accessToken = jwt.sign(
    {
      id: user._id,
      sessionId: session._id,
    },
    config.JWT_SECRET,
    { expiresIn: "15m" },
  );

  res.clearCookie("gateToken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.status(200).json({
    message: "User logged in successfully",
    user: user,
    accessToken,
  });
});

const refreshToken = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return next(new AppError("Refresh token missing", 401));
  }

  const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

  const refreshTokenHash = await crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
  const session = await sessionModel.findOne({
    refreshTokenHash,
    revoked: false,
  });

  if (!session) {
    return next(new AppError("Invalid refresh token", 401));
  }

  const accessToken = jwt.sign(
    {
      id: session.user,
      sessionId: session._id,
    },
    config.JWT_SECRET,
    { expiresIn: "15m" },
  );

  const newRefreshToken = jwt.sign({ id: session.user }, config.JWT_SECRET, {
    expiresIn: "7d",
  });

  const newRefreshTokenHash = await crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  session.refreshTokenHash = newRefreshTokenHash;
  await session.save();

  res.status(200).json({
    message: "Token refreshed successfully",
    accessToken,
  });
});

const logout = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return next(new AppError("Refresh token missing", 400));
  }

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await sessionModel.findOne({
    refreshTokenHash,
    revoked: false,
  });

  if (!session) {
    return next(new AppError("Invalid refresh token", 400));
  }

  session.revoked = true;
  await session.save();

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
    message: "User logout successfully",
  });
});

const logoutAll = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return next(new AppError("Refresh token missing", 400));
  }

  const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

  await sessionModel.updateMany(
    {
      user: decoded.id,
      revoked: false,
    },
    { revoked: true },
  );

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
    message: "User logout from all devices successfully",
  });
});

const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Email is required", 400));
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await userModel.findOne({ email: normalizedEmail });

  // User na mile to bhi same response (email exist karti hai ya nahi, ye leak nahi hota)
  if (!user) {
    return res
      .status(200)
      .json({ message: "If this email exists, a reset link has been sent" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.passwordResetToken = resetTokenHash;
  user.passwordResetExpires = Date.now() + 15 * 60 * 1000;
  await user.save();

  const resetUrl = `${config.FRONTEND_URL}/reset-password/${resetToken}`;

  await sendMail({
    to: user.email,
    subject: "Password Reset Request",
    html: `
            <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px; background:#f8fafc;border-radius:12px;">
                <h2 style="color:#1e293b;margin-bottom:8px;">Reset Your Password</h2>
                <p style="color:#475569;font-size:15px;">
                    We received a request to reset your password. Click the button below to create a new one.
                </p>
                <a href="${resetUrl}" style="
                    display:inline-block;padding:12px 28px;margin:20px 0;
                    background:#4f46e5;color:#ffffff;
                    border-radius:8px;text-decoration:none;
                    font-weight:bold;font-size:15px;
                ">Reset Password</a>
                <p style="color:#64748b;font-size:13px;">
                    This link will expire in <strong>15 minutes</strong>.
                </p>
                <p style="color:#64748b;font-size:13px;">
                    If you did not request a password reset, please ignore this email. Your account is safe.
                </p>
                <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
                <p style="color:#94a3b8;font-size:12px;text-align:center;">
                    &copy; ${new Date().getFullYear()} Bux Design. All rights reserved.
                </p>
            </div>
        `,
  });

  res
    .status(200)
    .json({ message: "If this email exists, a reset link has been sent" });
});

const resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  const resetTokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await userModel.findOne({
    passwordResetToken: resetTokenHash,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Invalid or expired reset token", 400));
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Password change ho chuka hai, confirmation email fail ho to bhi flow chalna chahiye
  try {
    await sendMail({
      to: user.email,
      subject: "Your Password Has Been Reset",
      html: `
            <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:12px;">
                <div style="text-align:center;margin-bottom:24px;">
                    <div style="display:inline-block;background:#dcfce7;border-radius:50%;padding:16px;">
                        <span style="font-size:32px;">✅</span>
                    </div>
                </div>
                <h2 style="color:#1e293b;text-align:center;margin-bottom:8px;">Password Reset Successful</h2>
                <p style="color:#475569;font-size:15px;text-align:center;">
                    Your password has been updated successfully. You are now logged in.
                </p>
                <p style="color:#64748b;font-size:13px;margin-top:24px;">
                    If you did not make this change, please contact our support team immediately.
                </p>
                <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
                <p style="color:#94a3b8;font-size:12px;text-align:center;">
                    &copy; ${new Date().getFullYear()} Bux Design. All rights reserved.
                </p>
            </div>
        `,
    });
  } catch (err) {
    console.error("Password reset confirmation email failed:", err.message);
  }

  await sessionModel.updateMany(
    { user: user._id, revoked: false },
    { revoked: true },
  );

  const refreshToken = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "7d",
  });
  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = new sessionModel({
    user: user._id,
    refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });
  await session.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const accessToken = jwt.sign(
    { id: user._id, sessionId: session._id },
    config.JWT_SECRET,
    { expiresIn: "15m" },
  );

  res.status(200).json({
    message: "Password reset successfully",
    accessToken,
    user: user,
  });
});

const verifyGateCode = catchAsync(async (req, res, next) => {
  const { code } = req.body;

  if (!code) {
    return next(new AppError("Code is required", 400));
  }

  const user = await userModel.findOne({
    email: config.ADMIN_EMAIL,
    role: "admin",
  });

  if (!user || !user.gateCode) {
    return next(new AppError("Invalid code", 400));
  }

  const isMatch = await bcrypt.compare(code, user.gateCode);
  if (!isMatch) {
    return next(new AppError("Invalid code", 400));
  }

  const gateToken = jwt.sign({ id: user.id, gate: true }, config.JWT_SECRET, {
    expiresIn: "10m",
  });

  res.cookie("gateToken", gateToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 10 * 60 * 1000,
  });

  res.status(200).json({ message: "Code verified. Proceed to login." });
});

const checkGateStatus = (req, res) => {
  const token = req.cookies?.gateToken;
  if (!token) return res.status(401).json({ verified: false });

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    if (decoded.gate) return res.status(200).json({ verified: true });
    return res.status(401).json({ verified: false });
  } catch {
    return res.status(401).json({ verified: false });
  }
};

const forgotGateCode = catchAsync(async (req, res, next) => {
  const user = await userModel.findOne({
    email: config.ADMIN_EMAIL,
    role: "admin",
  });

  if (!user) {
    return next(new AppError("Admin not found", 404));
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.gateCodeResetToken = resetTokenHash;
  user.gateCodeResetExpires = Date.now() + 15 * 60 * 1000;
  await user.save();

  const resetUrl = `${config.FRONTEND_URL}/reset-code/${resetToken}`;

  await sendMail({
    to: config.ADMIN_EMAIL,
    subject: "Code Reset Request",
    html: `
            <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:12px;">
                <h2 style="color:#1e293b;margin-bottom:8px;">Reset Your Gate Code</h2>
                <p style="color:#475569;font-size:15px;">
                    Click the button below to set a new gate code.
                </p>
                <a href="${resetUrl}" style="
                    display:inline-block;padding:12px 28px;margin:20px 0;
                    background:#4f46e5;color:#ffffff;
                    border-radius:8px;text-decoration:none;
                    font-weight:medium;font-size:15px;
                ">Reset Gate Code</a>
                <p style="color:#64748b;font-size:13px;">
                    This link will expire in <strong>15 minutes</strong>.
                </p>
                <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
                <p style="color:#94a3b8;font-size:12px;text-align:center;">
                    &copy; ${new Date().getFullYear()} Bux Design. All rights reserved.
                </p>
            </div>
        `,
  });

  res.status(200).json({ message: "Reset link sent to admin email" });
});

const resetGateCode = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { newCode } = req.body;

  if (!newCode) {
    return next(new AppError("New code is required", 400));
  }

  const resetTokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await userModel.findOne({
    gateCodeResetToken: resetTokenHash,
    gateCodeResetExpires: { $gt: Date.now() },
    role: "admin",
  });

  if (!user) {
    return next(new AppError("Invalid or expired reset token", 400));
  }

  user.gateCode = await bcrypt.hash(newCode, 10);
  user.gateCodeResetToken = undefined;
  user.gateCodeResetExpires = undefined;
  await user.save();

  res.status(200).json({ message: "Gate code reset successfully" });
});

module.exports = {
  userRegister,
  userLogin,
  refreshToken,
  logout,
  logoutAll,
  forgotPassword,
  resetPassword,
  verifyGateCode,
  checkGateStatus,
  forgotGateCode,
  resetGateCode,
};