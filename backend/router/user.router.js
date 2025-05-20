import { Router } from "express";
import { addUser, getAllUsers, login, uploadAvatar, updateUser, deleteUser } from "../controllers/user.controller.js";
import upload from '../middleware/multer.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import adminAuth from '../middleware/adminAuth.middleware.js';

const router = Router();

// Public routes
router.route('/add').post(addUser);
router.route('/login').post(login);

// Protected routes
router.route('/allusers').get(adminAuth, getAllUsers);
router.route('/upload-avatar').post(authMiddleware, upload.single('avatar'), uploadAvatar);
router.route('/update/:id').put(authMiddleware, updateUser);
router.route('/:id').delete(adminAuth, deleteUser);

export default router;