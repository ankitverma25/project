import { Router } from "express";
import { addUser, getAllUsers, login, uploadAvatar, updateUser, getPendingDealers, approveDealer, uploadDocument, getDocumentsStatus, verifyDocument, getCarDocuments, uploadCarDocument } from "../controllers/user.controller.js";
import upload from '../middleware/multer.middleware.js';
import { auth } from '../middleware/auth.middleware.js';
import adminAuth from '../middleware/adminAuth.middleware.js';
import dealerAuth from '../middleware/dealerAuth.middleware.js';

const router = Router();

router.route('/add').post(addUser);
router.route('/allusers').get(auth, getAllUsers);
router.route('/login').post(login);
router.route('/upload-avatar').post(auth, upload.single('avatar'), uploadAvatar);
router.route('/update/:id').put(auth, updateUser);

// Admin routes
router.route("/pending-dealers").get(adminAuth, getPendingDealers);
router.route("/approve-dealer/:id").post(adminAuth, approveDealer);

// Document routes
router.route('/uploadDocument').post(
    auth, 
    upload.fields([{ name: 'document', maxCount: 1 }]), 
    uploadDocument
);
router.route('/documents').get(auth, getDocumentsStatus);
router.route('/car/:carId/documents').get(auth, getCarDocuments);
router.route('/car/:carId/upload-document').post(
    auth, 
    upload.fields([{ name: 'document', maxCount: 1 }]), 
    uploadCarDocument
);

// Document verification route (admin/dealer only)
router.route('/verifyDocument').post(dealerAuth, verifyDocument);

export default router;