const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const reviewController = require("../controllers/reviewController");
const upload = require("../configs/multerConfig");

//* Public Access
router.get("/approved", reviewController.getApprovedReviews);
router.post("/submit/:token", upload.single("image"), reviewController.submitReview);

//* Users Access
router.get("/all", reviewController.getAllReviews);

//* Admin Access Only
router.post("/generate-link", authMiddleware, reviewController.generateReviewLink);
router.post("/update-status/:id", authMiddleware, reviewController.updateReviewStatus);
router.post("/delete/:id", authMiddleware, reviewController.deleteReview);

module.exports = router;