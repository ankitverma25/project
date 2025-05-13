import { Router } from "express";
import { 
  addCar, 
  getAllCars, 
  uploadDocument,
  acceptTerms,
  submitDocuments 
} from "../controllers/car.controller.js";
import upload from '../middleware/multer.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import universalAuth from '../middleware/universalAuth.middleware.js';

const router = Router();   

// Existing routes
router.route('/addCar').post(authMiddleware, upload.fields([
  { name: 'photos', maxCount: 5 },
  { name: 'rcBook', maxCount: 1 }
]), addCar);

router.route('/allCars').get(universalAuth, getAllCars);

// Document management routes
router.route('/upload-document').post(
  authMiddleware, 
  upload.single('document'), 
  uploadDocument
);

router.route('/accept-terms').post(authMiddleware, acceptTerms);
router.route('/submit-documents').post(authMiddleware, submitDocuments);

export default router;