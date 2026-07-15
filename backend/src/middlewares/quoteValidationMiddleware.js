const { body, validationResult } = require("express-validator");

const createQuoteValidator = [
  body("username")
    .trim()
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("service")
    .trim()
    .notEmpty().withMessage("Service is required")
    .isIn([
      "Redesign my app or website",
      "Hiring a dedicated UX/UI Designer",
      "Clickable Design Prototype",
      "Other",
      "Design A complete Product from scratch",
    ])
    .withMessage("Please select a valid service"),

  body("budget")
    .trim()
    .notEmpty().withMessage("Budget is required")
    .isIn(["less 1k", "2k-5k", "5k-10k", "cannot say"]).withMessage("Please select a valid budget range"),

  body("projectDescription")
    .trim()
    .notEmpty().withMessage("Project description is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  },
];

module.exports = { createQuoteValidator };