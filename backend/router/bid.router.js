import { Router } from 'express';
import dealerAuth from '../middleware/dealerAuth.middleware.js';
import universalAuth from '../middleware/universalAuth.middleware.js';
import { getAllBids, getBidsForCar, addBid } from '../controllers/bid.controller.js';

const router = Router();

router.get('/allBids', universalAuth, getAllBids);
router.get('/car/:carId', universalAuth, getBidsForCar);
router.post('/add', dealerAuth, addBid);

export default router;