import express from 'express';
import { generateCarValuation } from '../controllers/ai.controller.js';

const router = express.Router();

router.post('/estimate', generateCarValuation);

export default router;