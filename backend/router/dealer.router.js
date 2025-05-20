import express from 'express';
import { 
    dealerSignup, 
    dealerLogin, 
    getAllDealers,
    approveDealer,
    rejectDealer,
    getDealerById,
    deleteDealer
} from '../controllers/dealer.controller.js';
import adminAuth from '../middleware/adminAuth.middleware.js';
import { dealerAuth } from '../middleware/dealerAuth.middleware.js';

const router = express.Router();

// Public routes
router.post('/signup', dealerSignup);
router.post('/login', dealerLogin);

// Admin protected routes
router.get('/all', adminAuth, getAllDealers);
router.patch('/approve/:id', adminAuth, approveDealer);
router.delete('/reject/:id', adminAuth, rejectDealer);
router.get('/:id', adminAuth, getDealerById);
router.delete('/:id', adminAuth, deleteDealer);

export default router;
