import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';

// In-memory user store for instant testing when MongoDB Atlas is connecting or offline
const inMemoryUsers = [];

/**
 * @desc    Register a new student or instructor
 * @route   POST /api/users/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role, course } = req.body;

    // Validate incoming input
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, email, and password',
      });
    }

    // Hash password with bcrypt (10 salt rounds)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 1. If MongoDB Atlas is actively connected, use Mongoose
    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'A user with this email already exists',
        });
      }

      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role: role || 'student',
        course: course || 'Computer Science',
      });

      return res.status(201).json({
        success: true,
        message: `${newUser.role.charAt(0).toUpperCase() + newUser.role.slice(1)} registered successfully in MongoDB Atlas`,
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          course: newUser.course,
          createdAt: newUser.createdAt,
        },
      });
    }

    // 2. Fallback: In-memory store (for instant local / Postman testing)
    const existing = inMemoryUsers.find((u) => u.email === email);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    const newUser = {
      _id: new mongoose.Types.ObjectId().toString(),
      username,
      email,
      password: hashedPassword,
      role: role || 'student',
      course: course || 'Computer Science',
      createdAt: new Date().toISOString(),
    };

    inMemoryUsers.push(newUser);

    return res.status(201).json({
      success: true,
      message: `${newUser.role.charAt(0).toUpperCase() + newUser.role.slice(1)} registered successfully`,
      storage: 'Active Local Server',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        course: newUser.course,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error('Error in registerUser:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message,
    });
  }
};

/**
 * @desc    Authenticate user & login
 * @route   POST /api/users/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    let user;

    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ email });
    } else {
      user = inMemoryUsers.find((u) => u.email === email);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id || user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        course: user.course,
      },
    });
  } catch (error) {
    console.error('Error in loginUser:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/users/logout
 * @access  Public
 */
export const logoutUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'User logged out successfully',
  });
};
