const jwt = require("jsonwebtoken");
const config = require("../configs/config");
const sessionModel = require("../models/sessionModel");
const userModel = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized, please login" });
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, config.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }

  const session = await sessionModel.findOne({
    user: decoded.id,
    revoked: false,
  });

  if (!session) { return res.status(401).json({ message: "Session expired or revoked" }) }

  // isActive check - toggle route exclude
  const EXCLUDED_PATHS = ["/toggle-status", "/get-me"];
  let fetchedUser = null;
  if (!EXCLUDED_PATHS.some((path) => req.path.includes(path))) {
    fetchedUser = await userModel.findById(decoded.id);
    if (!fetchedUser || !fetchedUser.isActive) {
      return res.status(403).json({ success: false, message: "System is currently inactive" });
    }
  }

  req.user = {
    ...decoded,
    role: fetchedUser ? fetchedUser.role : undefined,
  };
  next();
};

module.exports = { authMiddleware };