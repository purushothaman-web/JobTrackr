import express from 'express';
import { register, login, getProfile, logout, updateProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateRegister, validateLogin } from '../middleware/authValidationMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { forgotPassword, resetPassword, verifyEmail, resendVerificationEmail } from '../controllers/authController.js';
import validateForgotPassword from '../middleware/validations/forgotPasswordValidation.js';
import validateResendVerification from '../middleware/validations/resendVerificationValidation.js';
import validateResetPassword from '../middleware/validations/resetPasswordValidation.js';

const router = express.Router();

router.post('/register', authLimiter, validateRegister, register); 
router.post('/login', authLimiter, validateLogin, login); 
router.post('/logout', logout);
router.get('/me', authenticate, getProfile);
router.put('/update-profile', authenticate, updateProfile);
router.post('/forgot-password', authLimiter, validateForgotPassword, forgotPassword);
router.post('/reset-password', authLimiter, validateResetPassword, resetPassword);


router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', validateResendVerification, resendVerificationEmail);

export default router;
