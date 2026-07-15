const { body, validationResult } = require("express-validator");

const createPortfolioValidator = [
  body("subTitle")
    .trim()
    .notEmpty().withMessage("Subtitle is required")
    .isLength({ max: 30 }).withMessage("Subtitle cannot exceed 30 characters"),

  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ max: 100 }).withMessage("Title cannot exceed 100 characters"),

  body("description")
    .trim()
    .notEmpty().withMessage("Description is required")
    .isLength({ max: 400 }).withMessage("Description cannot exceed 400 characters"),

  body("field")
    .trim()
    .notEmpty().withMessage("Field is required")
    .isIn(["Website", "Mobile-app", "Featured"]).withMessage("Please select a valid field"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  },
];

const updatePortfolioValidator = [
  body("subTitle")
    .optional()
    .trim()
    .isLength({ max: 30 }).withMessage("Subtitle cannot exceed 30 characters"),

  body("title")
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage("Title cannot exceed 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 400 }).withMessage("Description cannot exceed 400 characters"),

  body("field")
    .optional()
    .trim()
    .isIn(["Website", "Mobile-app", "Featured"]).withMessage("Please select a valid field"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  },
];

module.exports = { createPortfolioValidator, updatePortfolioValidator };