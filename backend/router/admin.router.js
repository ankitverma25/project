import express from 'express';
import { adminSignup, adminLogin } from '../controllers/admin.controller.js';
import adminAuth from '../middleware/adminAuth.middleware.js';

const router = express.Router();

router.post('/signup', adminSignup);
router.post('/login', adminLogin);
// Example protected route:
// router.get('/dashboard', adminAuth, (req, res) => res.json({ message: 'Admin dashboard', admin: req.admin }));

export default router;
