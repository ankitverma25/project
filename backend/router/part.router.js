import express from 'express';
import { universalAuth } from '../middleware/universalAuth.middleware.js';
import upload from '../middleware/multer.middleware.js';
import {
  createPart,
  getAllParts,
  getPartById,
  updatePart,
  deletePart,
  markAsSold,
  getMyParts,
  searchParts
} from '../controllers/part.controller.js';

const router = express.Router();

// Create a new part - requires authentication and image upload support
router.post('/create', universalAuth, upload.array('images', 5), createPart);

// Get all parts with filtering - accessible to all users but ownership info only for authenticated users
router.get('/all', universalAuth, getAllParts);

// Get my parts
router.get('/my-parts', universalAuth, getMyParts);

// Search parts
router.get('/search', universalAuth, searchParts);

// Get a specific part - accessible to all users but ownership info only for authenticated users
router.get('/:id', universalAuth, getPartById);

// Update a part - requires authentication and optional image upload
router.put('/:id', universalAuth, upload.array('images', 5), updatePart);

// Delete a part - requires authentication
router.delete('/:id', universalAuth, deletePart);

// Mark a part as sold - requires authentication
router.patch('/:id/mark-sold', universalAuth, markAsSold);

export default router;