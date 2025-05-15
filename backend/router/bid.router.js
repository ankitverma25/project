import express from 'express';
import { getAllBids, getBidsForCar, addBid, acceptBid, getAcceptedBids } from '../controllers/bid.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { dealerAuth } from '../middleware/dealerAuth.middleware.js';

const router = express.Router();

// Routes
router.get('/all', getAllBids);
router.get('/car/:carId', getBidsForCar);
router.post('/add', dealerAuth, addBid);
router.post('/accept/:bidId', acceptBid);
router.get('/accepted-bids', authMiddleware, getAcceptedBids);

export default router;