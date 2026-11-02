import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
} from '../controllers/userController.js';

const router = express.Router();

/**
 * Route: POST /api/users/register
 * Description: Register a new user with hashed password
 */
router.post('/register', registerUser);

/**
 * Route: POST /api/users/login
 * Description: Authenticate user & login
 */
router.post('/login', loginUser);

/**
 * Route: POST /api/users/logout
 * Description: Clear session / logout
 */
router.post('/logout', logoutUser);

export default router;
