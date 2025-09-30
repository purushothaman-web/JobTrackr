import { body, validationResult } from 'express-validator';
import sanitizeHtml from 'sanitize-html';

const sanitizeTextInput = (text) => {
  return sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {},
  });
};

const sanitizeEmailInput = (email) => {
  return email.trim().toLowerCase();
};

export const validateRegister = [
  body('name')
    .isString()
    .notEmpty()
    .withMessage('Name is required')
    .customSanitizer(sanitizeTextInput),
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail()
    .customSanitizer(sanitizeEmailInput),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/)
    .withMessage('Password must contain at least one special character'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateLogin = [
  body('login')
    .isString()
    .notEmpty()
    .withMessage('Email or username is required')
    .customSanitizer(sanitizeTextInput),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
