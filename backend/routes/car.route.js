import express from "express";
import { addCar, getAllCars, uploadDocument, acceptTerms, submitDocuments } from "../controllers/car.controller.js";
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ...existing routes...

// Document management routes
router.post('/upload-document', upload.fields([{ name: 'document', maxCount: 1 }]), uploadDocument);
router.post('/accept-terms', acceptTerms);
router.post('/submit-documents', submitDocuments);

export default router;