import { Router } from "express";
import { addCar, getAllCars, uploadDocument, getDocumentsStatus, verifyDocument } from "../controllers/car.controller.js";
import upload from '../middleware/multer.middleware.js';
import {auth} from '../middleware/auth.middleware.js';
import universalAuth from '../middleware/universalAuth.middleware.js';
import dealerAuth from '../middleware/dealerAuth.middleware.js';

const router = Router();   

router.route('/addCar').post(auth, upload.fields([
  { name: 'photos', maxCount: 5 },
  { name: 'rcBook', maxCount: 1 }
]), addCar);

router.route('/allCars').get(universalAuth, getAllCars);

router.route('/uploadDocument').post(
  auth, 
  upload.fields([{ name: 'document', maxCount: 1 }]), 
  uploadDocument
);

router.route('/documents').get(auth, getDocumentsStatus);

// New route for document verification (admin/dealer only)
router.route('/verifyDocument').post(dealerAuth, verifyDocument);

export default router;