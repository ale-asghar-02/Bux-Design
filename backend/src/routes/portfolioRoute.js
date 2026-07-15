const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const { createPortfolioValidator, updatePortfolioValidator } = require("../middlewares/portfolioValidationMiddleware");
const portfolioController = require("../controllers/portfolioController");
const upload = require("../configs/multerConfig");

//* Public Access
router.get("/all", portfolioController.getAllPortfolios);

//* Users Access Only
router.post("/create", authMiddleware, upload.array("images"), createPortfolioValidator, portfolioController.createPortfolio);
router.get("/my-portfolios", authMiddleware, portfolioController.getMyPortfolios);
router.post("/update/:id", authMiddleware, upload.array("images"), updatePortfolioValidator, portfolioController.updatePortfolio);
router.post("/delete/:id", authMiddleware, portfolioController.deletePortfolio);

module.exports = router;