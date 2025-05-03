import { Router } from "express";
import { addUser, getAllUsers, login, uploadAvatar, updateUser } from "../controllers/user.controller.js";
import upload from '../middleware/multer.middleware.js';
import { auth } from '../middleware/auth.middleware.js';

const router = Router();

router.route('/add').post(addUser);
router.route('/allusers').get(auth, getAllUsers);
router.route('/login').post(login);
router.route('/upload-avatar').post(auth, upload.single('avatar'), uploadAvatar);
router.route('/update/:id').put(auth, updateUser);

export default router;