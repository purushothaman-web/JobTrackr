import ApiError from '../utils/ApiError.js';

const errorHandler = (err, req, res, next) => {
  console.error(`${req.method} ${req.originalUrl} - ${err.stack}`);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).json({
    status: err.status,
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export default errorHandler;