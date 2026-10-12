// middleware/validate.js
// Request rules shared by the routes, built on express-validator.
// `validate` runs last: it stops the request with a 400 and the first error message.
import { body, param, validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
};

const emailMsg = "Enter a valid email address";
const email = body("email").isString().withMessage(emailMsg).trim().isEmail().withMessage(emailMsg);

export const signupRules = [
  email,
  body("password")
    .isString()
    .isLength({ min: 8, max: 72 })
    .withMessage("Password must be 8 to 72 characters"),
  body("confirmPassword").isString().withMessage("Please confirm your password"),
];

export const loginRules = [
  email,
  body("password").isString().notEmpty().withMessage("Enter your password"),
];

export const mongoIdParam = param("id").isMongoId().withMessage("Invalid issue id");

export const issueRules = [
  body("constituency").isString().trim().isLength({ min: 2, max: 60 }).withMessage("Choose a constituency"),
  body("title").isString().trim().isLength({ min: 3, max: 100 }).withMessage("Title must be 3 to 100 characters"),
  body("description")
    .isString()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be 10 to 1000 characters"),
  body("category")
    .isIn(["Pothole", "Garbage", "Electricity", "Water", "Other"])
    .withMessage("Choose a valid category"),
  body("latitude").optional({ values: "falsy" }).isFloat({ min: -90, max: 90 }).withMessage("Invalid location"),
  body("longitude").optional({ values: "falsy" }).isFloat({ min: -180, max: 180 }).withMessage("Invalid location"),
];

export const commentRules = [
  body("text").isString().trim().isLength({ min: 1, max: 500 }).withMessage("Comment must be 1 to 500 characters"),
];
