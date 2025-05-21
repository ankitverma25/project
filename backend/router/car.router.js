import express from 'express';
import { 
  addCar, 
  getAllCars, 
  uploadDocument,
  acceptTerms,
  submitDocuments,
  getSubmittedDocuments,
  verifyDocument,
  verifyFinal,
  markReadyForPickup,
  getVerifiedCars
} from "../controllers/car.controller.js";
import upload from '../middleware/multer.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { dealerAuth } from '../middleware/dealerAuth.middleware.js';
import adminAuth from '../middleware/adminAuth.middleware.js';
import universalAuth from '../middleware/universalAuth.middleware.js';

const router = express.Router();

// Universal routes
router.get('/allCars', universalAuth, getAllCars);

// Protected routes
router.post('/addCar', authMiddleware, upload.fields([
  { name: 'photos', maxCount: 5 },
  { name: 'rcBook', maxCount: 1 }
]), addCar);

// Document management routes
router.post('/upload-document', authMiddleware, upload.single('document'), uploadDocument);
router.post('/accept-terms', authMiddleware, acceptTerms);
router.post('/submit-documents', authMiddleware, submitDocuments);

// Dealer document verification routes
router.get('/submitted-documents', dealerAuth, getSubmittedDocuments);
router.post('/verify-document', dealerAuth, verifyDocument);
router.post('/verify-final', dealerAuth, verifyFinal);
router.post('/mark-ready-for-pickup/:carId', dealerAuth, markReadyForPickup);
router.get('/verified-cars', dealerAuth, getVerifiedCars);

export default router;