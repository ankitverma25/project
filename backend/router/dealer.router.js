import express from 'express';
import { dealerSignup, dealerLogin, getPendingDealers, approveDealer } from '../controllers/dealer.controller.js';
import { auth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', dealerSignup);
router.post('/login', dealerLogin);
router.get('/pending', getPendingDealers);
router.patch('/approve/:id', approveDealer);

export default router;
