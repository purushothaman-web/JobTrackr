import { query, validationResult } from 'express-validator';

export const validateJobQueryParams = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
  query('status').optional().isString().trim().isIn(['applied', 'interview', 'offer', 'rejected']),
  query('sortBy').optional().isString().trim().isIn(['createdAt', 'position', 'company']),
  query('order').optional().isString().trim().isIn(['asc', 'desc']),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];
