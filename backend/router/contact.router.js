import express from 'express';
import { createContact, getAllContacts, updateContact, deleteContact } from '../controllers/contact.controller.js';
import adminAuth from '../middleware/adminAuth.middleware.js';

const router = express.Router();

// Public route for creating contact messages
router.post('/create', createContact);

// Admin protected routes
router.get('/all', adminAuth, getAllContacts);
router.put('/update/:id', adminAuth, updateContact);
router.delete('/delete/:id', adminAuth, deleteContact);

export default router;
