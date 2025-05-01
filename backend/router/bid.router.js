import { Router } from 'express';
import { getAllBids, getBidsForCar } from '../controllers/bid.controller.js';

const router = Router();

router.get('/allBids', getAllBids);
router.get('/car/:carId', getBidsForCar);

export default router;