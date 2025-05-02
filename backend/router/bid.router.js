import { Router } from 'express';
import dealerAuth from '../middleware/dealerAuth.middleware.js';
import { getAllBids, getBidsForCar, addBid } from '../controllers/bid.controller.js';

const router = Router();

router.get('/allBids', getAllBids);
router.get('/car/:carId', getBidsForCar);
router.post('/add', dealerAuth, addBid);

export default router;