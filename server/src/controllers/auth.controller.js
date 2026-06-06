const User = require('../models/User');
const Otp = require('../models/Otp');
const Analysis = require('../models/Analysis');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const axios = require('axios');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    if (!otp) {
      return res.status(400).json({ success: false, message: 'Please provide OTP verification code' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Verify OTP
    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'No OTP requested for this email' });
    }

    if (otpRecord.expiresAt < new Date()) {
      await otpRecord.deleteOne();
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one' });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP code' });
    }

    // Delete OTP record
    await otpRecord.deleteOne();

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      // Send welcome email
      const welcomeHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #38B2AC; text-align: center;">Welcome to BluePrint, ${name}!</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">Your account has been successfully created. We are excited to have you onboard!</p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">BluePrint helps you scan your resume, evaluate it against job descriptions using Google Gemini AI, identify critical skill gaps, and build dynamic learning paths to accelerate your career.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="background: #0F172A; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 800; font-size: 15px; display: inline-block;">Start Analyzing Now</a>
          </div>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">BluePrint AI Skill Gap Analyzer &copy; 2026</p>
        </div>
      `;

      sendEmail({
        email: user.email,
        subject: 'Welcome to BluePrint - Account Created',
        message: `Welcome to BluePrint, ${name}! Your account has been created successfully.`,
        html: welcomeHtml
      }).catch(err => console.error('Error sending welcome email:', err.message));

      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile & scan statistics
// @route   GET /api/auth/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Fetch and aggregate history
    const analyses = await Analysis.find({ user: req.user._id });

    const totalScans = analyses.length;
    let highestAts = 0;
    let avgMatch = 0;
    const missingSkillsMap = {};

    if (totalScans > 0) {
      let sumMatch = 0;
      analyses.forEach((item) => {
        if (item.atsScore > highestAts) {
          highestAts = item.atsScore;
        }
        sumMatch += item.matchPercentage || 0;

        if (item.missingSkills && Array.isArray(item.missingSkills)) {
          item.missingSkills.forEach((skill) => {
            missingSkillsMap[skill] = (missingSkillsMap[skill] || 0) + 1;
          });
        }
      });
      avgMatch = Math.round(sumMatch / totalScans);
    }

    // Sort missing skills to find top gaps
    const topMissingSkills = Object.entries(missingSkillsMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map((entry) => ({ name: entry[0], count: entry[1] }));

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        stats: {
          totalScans,
          highestAts,
          avgMatch,
          topMissingSkills,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile details
// @route   PUT /api/auth/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update simple fields
    if (req.body.name) user.name = req.body.name;

    // Check email availability if changing
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      user.email = req.body.email;
    }

    // Update password if requested
    if (req.body.newPassword) {
      if (!req.body.currentPassword) {
        return res.status(400).json({ success: false, message: 'Please provide current password to update password' });
      }
      const isMatch = await user.matchPassword(req.body.currentPassword);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Incorrect current password' });
      }
      user.password = req.body.newPassword;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user account and all scan histories
// @route   DELETE /api/auth/profile
// @access  Private
exports.deleteUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, email } = user;

    // Purge associated scan histories
    await Analysis.deleteMany({ user: req.user._id });

    // Delete user
    await user.deleteOne();

    // Send goodbye email
    const goodbyeHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #EF4444; text-align: center;">Account Deleted</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">Hello ${name},</p>
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">We are writing to confirm that your BluePrint account and all associated diagnostic scan history records have been permanently deleted from our databases.</p>
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">We are sorry to see you go. If there is anything we could have done better, or if you decide to rejoin us in the future, you are always welcome back.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">BluePrint AI Skill Gap Analyzer &copy; 2026</p>
      </div>
    `;

    sendEmail({
      email,
      subject: 'BluePrint Account Deleted Successfully',
      message: `Hello ${name}, your BluePrint account and scan history have been permanently deleted.`,
      html: goodbyeHtml
    }).catch(err => console.error('Error sending goodbye email:', err.message));

    res.status(200).json({
      success: true,
      message: 'Account and all scan history records have been permanently deleted.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send OTP to email for validation
// @route   POST /api/auth/send-otp
// @access  Public
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email' });
    }

    // Check if email already registered
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiry (5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Save/Update in Otp collection
    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    // Prepare email content
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #0F172A; text-align: center;">Welcome to BluePrint</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">Thank you for signing up for BluePrint. To verify your email address, please use the following One-Time Password (OTP):</p>
        <div style="background: #f8fafc; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 28px; font-weight: 800; text-align: center; color: #38B2AC; letter-spacing: 4px; margin: 24px 0;">
          ${otp}
        </div>
        <p style="color: #64748B; font-size: 14px; line-height: 1.6;">This OTP is valid for <strong>5 minutes</strong>. If you did not request this code, you can safely ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">BluePrint AI Skill Gap Analyzer &copy; 2026</p>
      </div>
    `;

    sendEmail({
      email,
      subject: 'Verify your BluePrint account - OTP',
      message: `Your BluePrint verification code is: ${otp}. It is valid for 5 minutes.`,
      html
    }).catch(err => console.error('Error sending OTP email:', err.message));

    res.status(200).json({ success: true, message: 'OTP sent successfully to email' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Request password reset link
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ success: true, message: 'If registered, a recovery link has been sent.' });
    }

    // Generate random reset token (raw token)
    const rawResetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set expiry (10 minutes)
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(rawResetToken)
      .digest('hex');

    const resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpire = resetPasswordExpire;
    await user.save();

    // Reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${rawResetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #0F172A; text-align: center;">Reset Your Password</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">You requested a password reset for your BluePrint account. Please click the button below to reset your credentials:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #38B2AC; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 800; font-size: 15px; display: inline-block; box-shadow: 0 4px 10px rgba(56,178,172,0.25);">Reset Password</a>
        </div>
        <p style="color: #64748B; font-size: 14px; line-height: 1.6;">This link is valid for <strong>10 minutes</strong>. If you did not request this link, you can safely ignore this email and your password will remain unchanged.</p>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">If the button above does not work, copy and paste the following URL into your browser: <br/> <a href="${resetUrl}" style="color: #38B2AC; text-decoration: underline;">${resetUrl}</a></p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">BluePrint AI Skill Gap Analyzer &copy; 2026</p>
      </div>
    `;

    sendEmail({
      email: user.email,
      subject: 'Reset your BluePrint password',
      message: `You requested a password reset. Reset your password here: ${resetUrl}`,
      html
    }).catch(err => console.error('Error sending reset email:', err.message));

    res.status(200).json({ success: true, message: 'Recovery link sent successfully to email' });
  } catch (error) {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset password using recovery token
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { resetToken } = req.params;

    if (!password) {
      return res.status(400).json({ success: false, message: 'Please provide a new password' });
    }

    // Hash token to compare with database
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired recovery token' });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate with Google SSO credential token
// @route   POST /api/auth/google
// @access  Public
exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential token is required' });
    }

    // Hit Google tokeninfo API to verify credential integrity
    let googleResponse;
    try {
      googleResponse = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    } catch (err) {
      return res.status(400).json({ success: false, message: 'Invalid Google credential token' });
    }

    const { email, email_verified, name, sub, picture } = googleResponse.data;

    if (process.env.GOOGLE_CLIENT_ID && googleResponse.data.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(400).json({ success: false, message: 'Google client ID mismatch' });
    }

    if (!email_verified) {
      return res.status(400).json({ success: false, message: 'Google email is not verified' });
    }

    // Check if user exists in our DB
    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString('hex');
      user = await User.create({
        name,
        email,
        password: randomPassword
      });

      // Send welcome email
      const welcomeHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #38B2AC; text-align: center;">Welcome to BluePrint, ${name}!</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">Your account has been successfully created via Google Sign-In. We are excited to have you onboard!</p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">BluePrint helps you scan your resume, evaluate it against job descriptions using Google Gemini AI, identify critical skill gaps, and build dynamic learning paths to accelerate your career.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="background: #0F172A; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 800; font-size: 15px; display: inline-block;">Start Analyzing Now</a>
          </div>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">BluePrint AI Skill Gap Analyzer &copy; 2026</p>
        </div>
      `;

      sendEmail({
        email: user.email,
        subject: 'Welcome to BluePrint - Account Created',
        message: `Welcome to BluePrint, ${name}! Your account has been created successfully.`,
        html: welcomeHtml
      }).catch(err => console.error('Error sending welcome email:', err.message));
    }

    res.status(200).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
