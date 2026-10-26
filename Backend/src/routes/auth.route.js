import {Router} from 'express'
import authController from '../controllers/auth.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'

const authRoutes = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 */
authRoutes.post('/register', authController.registerUser);

/**
 * @route POST /api/auth/login
 * @desc Logs in the user and returns access & refresh tokens
 */
authRoutes.post('/login', authController.loginUser);

/**
 * @route GET /api/auth/refreshTokens
 * @desc Refreshes Access & Refresh Tokens
 */
authRoutes.get('/refreshTokens', authController.refreshTokens);

/**
 * @route GET /api/auth/logout
 * @desc Logs out the user by revoking the refresh token
 */
authRoutes.get('/logout', authController.logout);

/**
 * @route GET /api/auth/logoutAll
 * @desc Logs out the user by revoking all the refresh token
 */
authRoutes.get('/logoutAll', authController.logoutAll);

/**
 * @route POST /api/auth/verify-email
 * @desc Verifies the user's email using the OTP
 */
authRoutes.post('/verify-email', authController.verifyEmail);

/**
 * @route GET /api/auth/me
 * @desc Get the details of the logged in user
 */
authRoutes.get('/me', authMiddleware, authController.getMe);


export default authRoutes;