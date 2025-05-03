import { Router } from "express";
import { addCar, getAllCars } from "../controllers/car.controller.js";
import upload from '../middleware/multer.middleware.js';
import {auth} from '../middleware/auth.middleware.js';
import universalAuth from '../middleware/universalAuth.middleware.js';

const router = Router();   

router.route('/addCar').post(auth, upload.fields([
  { name: 'photos', maxCount: 5 },
  { name: 'rcBook', maxCount: 1 }
]), addCar);
router.route('/allCars').get(universalAuth, getAllCars);

export default router;