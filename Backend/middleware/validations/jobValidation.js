import { body, validationResult } from 'express-validator';
import sanitizeHtml from 'sanitize-html';

// Sanitize text input
const sanitizeTextInput = (text) => {
  return sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {},
  });
};

const validateJobData = [
  body('position')
    .isString()
    .notEmpty()
    .withMessage('Position must be a non-empty string')
    .customSanitizer(sanitizeTextInput),
  body('company')
    .isString()
    .notEmpty()
    .withMessage('Company must be a non-empty string')
    .customSanitizer(sanitizeTextInput),
  body('status')
    .isString()
    .notEmpty()
    .withMessage('Status must be a non-empty string')
    .customSanitizer(sanitizeTextInput),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export default validateJobData;