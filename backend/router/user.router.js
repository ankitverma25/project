import { Router } from "express";
import { addUser, getAllUsers, login, uploadAvatar, updateUser } from "../controllers/user.controller.js";
import upload from '../middleware/multer.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.route('/add').post(addUser);
router.route('/allusers').get(authMiddleware, getAllUsers);
router.route('/login').post(login);
router.route('/upload-avatar').post(authMiddleware, upload.single('avatar'), uploadAvatar);
router.route('/update/:id').put(authMiddleware, updateUser);

export default router;