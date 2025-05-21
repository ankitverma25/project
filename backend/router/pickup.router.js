import express from 'express';
import {  createPickup,
  schedulePickup,
  userReschedulePickup,
  getUserPickups,
  getDealerPickups,
  getPickupById,
  getPickupByCarId,
  completePickup,
  checkPickupExists
} from '../controllers/pickup.controller.js';
import { dealerAuth } from '../middleware/dealerAuth.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create pickup (should be called after car documents are verified)
router.post('/create', dealerAuth, createPickup);

// Dealer schedules/reschedules pickup
router.put('/schedule/:pickupId', dealerAuth, schedulePickup);

// User requests reschedule
router.put('/user-reschedule/:pickupId', authMiddleware, userReschedulePickup);

// Get pickups for user
router.get('/user', authMiddleware, getUserPickups);

// Get pickups for dealer
router.get('/dealer', dealerAuth, getDealerPickups);

// Get pickup by ID
router.get('/:pickupId', authMiddleware, getPickupById);

// Get pickup by carId
router.get('/car/:carId', dealerAuth, getPickupByCarId);

// Mark pickup as complete
router.post('/complete/:pickupId', dealerAuth, completePickup);

// Check if pickup exists for a car
router.get('/check/:carId', dealerAuth, checkPickupExists);

export default router;
