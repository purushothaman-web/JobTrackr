import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from "../generated/prisma/index.js";
import crypto from 'crypto';
import { sendEmail } from '../utils/email.js';
import ApiError from '../utils/ApiError.js';
import generateToken from '../utils/jwtUtils.js';

const prisma = new PrismaClient();

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidName = (name) => {
  return name && name.length > 0;
}

const isValidPassword = (password) => {
    return password && password.length >= 6; // Basic password length validation
}

const isValidLogin = (login) => {
  return login && login.length > 0;
}

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // Validation and sanitization handled by express-validator middleware
    // ...existing code...

    // 5. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // 6. Create user in DB
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerificationToken,
        emailVerified: false,
      },
    });

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${emailVerificationToken}`;
    const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #333;">📩 Verify Your Email Address</h2>
      <p>Hello,</p>
      <p>Thank you for registering! Please verify your email by clicking the button below:</p>
      <p style="text-align: center;">
        <a href="${verificationUrl}" 
           style="
             display: inline-block; 
             padding: 12px 24px; 
             font-size: 16px; 
             color: #fff; 
             background-color: #10B981; 
             text-decoration: none; 
             border-radius: 5px;
             font-weight: bold;
           ">
          Verify Email
        </a>
      </p>
      <p>If you did not request this, please ignore this email.</p>
      <hr style="margin-top: 30px; border-color: #ddd;" />
      <p style="font-size: 12px; color: #666;">
        If the button above doesn’t work, copy and paste the following link into your browser:
      </p>
      <p style="font-size: 12px; color: #007acc;">
        <a href="${verificationUrl}" style="color: #007acc;">${verificationUrl}</a>
      </p>
    </div>
  `;
  

    await sendEmail(user.email, "Email Verification", message)
    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        token: token,
        emailVerified: user.emailVerified,
      }
    });
    
  } catch (error) {
    console.error("Registration error:", error);
  res.status(500).json({ success: false, error: error.message });
  }
};

export const login = async (req, res, next) => {
  const { login, password } = req.body;
  try {
    // Validation and sanitization handled by express-validator middleware
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: login },
          { name: login }
        ]
      }
    });
      if (!user) {
        console.warn(`Failed login attempt: user not found for login '${login}'`);
        throw new ApiError(401, "Invalid credentials");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.warn(`Failed login attempt: incorrect password for user '${login}'`);
        throw new ApiError(401, "Invalid credentials");
      }
    const token = generateToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        token: token,
        emailVerified: user.emailVerified,
      }
    });
  } catch (error) {
    console.error("Login error:", error);
  res.status(500).json({ success: false, error: error.message });
  }
};

export const getProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, emailVerified: true },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

  res.status(200).json({ success: true, data: user });

  } catch (error) {
    console.error("Get profile error:", error);
  res.status(500).json({ success: false, error: error.message });
  }
};


export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    // Validation and sanitization handled by express-validator middleware
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour
    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: expires,
      },
    });
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #333;">🔐 Password Reset Request</h2>
        <p>Hello,</p>
        <p>You requested a password reset. Click the button below to reset your password:</p>
        <p style="text-align: center;">
          <a href="${resetUrl}" style="background-color: #1D4ED8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
            Reset Password
          </a>
        </p>
        <p>This link will expire in <strong>1 hour</strong>.</p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <hr style="margin-top: 30px;" />
        <p style="font-size: 12px; color: #888;">If the button above doesn't work, paste this link into your browser:</p>
        <p style="font-size: 12px;"><a href="${resetUrl}">${resetUrl}</a></p>
      </div>
    `;
    await sendEmail(user.email, 'Password Reset Request', message);
  res.status(200).json({ success: true, data: { message: 'Password reset email sent.' } });
  } catch (error) {
    console.error('Forgot Password error:', error);
  res.status(500).json({ success: false, error: error.message });
  }
};


export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    // Validation and sanitization handled by express-validator middleware
    // Hash the received token to compare with DB stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    // Find user by hashed reset token and check token expiry
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { gt: new Date() },
      },
    });
    if (!user) {
      throw new ApiError(400, 'Invalid or expired token.');
    }
    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Update user password and clear reset token fields
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });
  res.status(200).json({ success: true, data: { message: 'Password has been reset successfully.' } });
  } catch (error) {
    console.error('Reset Password error:', error);
  res.status(500).json({ success: false, error: error.message });
  }
};

export const verifyEmail = async (req, res, next) => {
  const { token } = req.params;

  try {
    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new ApiError(400, 'Invalid or expired verification token.');
    }

    // Update user to mark email as verified and remove token
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
      },
    });

    // Generate JWT token and set cookie
    const jwtToken = generateToken(updatedUser);

    res.cookie('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return minimal user info (optional)
    const userPayload = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
    };

    res.status(200).json({
      success: true,
      data: {
        message: 'Email successfully verified and you are now logged in.',
        user: userPayload,
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);
  res.status(500).json({ success: false, error: error.message });
  }
};


export const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;
  try {
    // Validation and sanitization handled by express-validator middleware
    const user = await prisma.user.findUnique({ where: {email}});
    if (!user){
      throw new ApiError(400, "User with this email does not exist");
    }
    if (user.emailVerified){
      throw new ApiError(400, "Email is already verified");
    }
    let token = user.emailVerificationToken;
    if (!token) {
      token = crypto.randomBytes(32).toString('hex');
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerificationToken: token },
      });
    }
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #333;">📩 Verify Your Email Address</h2>
        <p>Hello,</p>
        <p>Thanks for registering. Please verify your email address by clicking the button below:</p>
        <p style="text-align: center;">
          <a href="${verificationUrl}" style="background-color: #10B981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
            Verify Email
          </a>
        </p>
        <p>This helps us confirm your identity and keep your account secure.</p>
        <p>If you didn’t create an account, you can safely ignore this email.</p>
        <hr style="margin-top: 30px;" />
        <p style="font-size: 12px; color: #888;">If the button above doesn't work, paste this link into your browser:</p>
        <p style="font-size: 12px;"><a href="${verificationUrl}">${verificationUrl}</a></p>
      </div>
    `;
    await sendEmail(user.email, "Email Verification", message);
  return res.status(200).json({ success: true, data: { message: "Verification email resent" } });
  } catch (error) {
    console.error("Resend verification email error:", error);
  res.status(500).json({ success: false, error: error.message });
  }
}

// In authController.js
export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
  });
  res.status(200).json({ success: true, data: { message: 'Logged out successfully' } });
};

// Update profile controller
export const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, email, password, currentPassword } = req.body;
  try {
    // Find user
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // If changing password, require current password
    let hashedPassword = undefined;
    if (password) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, error: 'Current password required to change password' });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Current password is incorrect' });
      }
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // If changing email, check for uniqueness
    if (email && email !== user.email) {
      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ success: false, error: 'Email already in use' });
      }
    }

    // If changing name, check for uniqueness
    if (name && name !== user.name) {
      const existingName = await prisma.user.findUnique({ where: { name } });
      if (existingName) {
        return res.status(400).json({ success: false, error: 'Name already in use' });
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name ? { name } : {}),
        ...(email ? { email } : {}),
        ...(hashedPassword ? { password: hashedPassword } : {}),
      },
    });

    res.status(200).json({
      success: true,
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        emailVerified: updatedUser.emailVerified,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};