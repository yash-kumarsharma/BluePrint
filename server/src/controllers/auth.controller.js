const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const Analysis = require('../models/Analysis');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
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

    // Purge associated scan histories
    await Analysis.deleteMany({ user: req.user._id });

    // Delete user
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Account and all scan history records have been permanently deleted.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
