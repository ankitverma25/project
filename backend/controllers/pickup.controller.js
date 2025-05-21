import mongoose from 'mongoose';
import Pickup from '../models/pickup.model.js';
import Car from '../models/car.model.js';

// Create a pickup (triggered after all documents are verified)
export const createPickup = async (req, res) => {
  console.log('Received /pickup/create body:', req.body);
  try {
    const { carId, userId, dealerId, scheduledDate, assignedEmployee, employeeContact, employeeDesignation, notes } = req.body;

    if (!carId || !userId || !dealerId) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: { carId, userId, dealerId },
      });
    }    // Check if car exists and dealer is authorized
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    if (!car.acceptedDealer || car.acceptedDealer.toString() !== dealerId) {
      return res.status(403).json({ message: 'Not authorized to create pickup for this car' });
    }

    // Check if all required documents are verified
    const requiredDocs = ['idProof', 'insurance', 'pollution', 'addressProof'];
    const allVerified = requiredDocs.every(docKey => 
      car.documents?.[docKey]?.status === 'verified'
    );
    if (!allVerified) {
      return res.status(400).json({ message: 'All car documents must be verified before creating pickup' });
    }    // Start transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const pickup = new Pickup({
        car: carId,
        user: userId,
        dealer: dealerId,
        status: scheduledDate ? 'scheduled' : 'pending',
        scheduledDate: scheduledDate || undefined,
        assignedEmployee: assignedEmployee || undefined,
        employeeContact: employeeContact || undefined,
        employeeDesignation: employeeDesignation || undefined,
        notes: notes || undefined,
      });

      console.log('Creating new pickup:', pickup);
      const savedPickup = await pickup.save({ session });
      
      // Mark car as pickup created
      await Car.findByIdAndUpdate(carId, { 
        pickupCreated: true,
        readyForPickup: true 
      }, { session });

      await session.commitTransaction();
      
      // After successful transaction, populate the response
      const populatedPickup = await Pickup.findById(savedPickup._id)
        .populate('car')
        .populate('user')
        .populate('dealer');
      
      res.status(201).json(populatedPickup);
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }

    const populatedPickup = await Pickup.findById(savedPickup._id)
      .populate('car')
      .populate('user')
      .populate('dealer');
    res.status(201).json(populatedPickup);  } catch (err) {
    console.error('Create pickup error:', err);
    if (err.code === 11000) {
      res.status(400).json({ message: 'Pickup already exists for this car' });
    } else {
      res.status(500).json({ 
        message: 'Failed to create pickup',
        error: err.message 
      });
    }
  }
};

// Dealer schedules or reschedules a pickup
export const schedulePickup = async (req, res) => {
  try {
    const { pickupId } = req.params;
    const { scheduledDate, assignedEmployee, employeeContact, employeeDesignation, notes, reason } = req.body;    // Validate required fields
    if (!scheduledDate || !assignedEmployee || !employeeContact || !employeeDesignation) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: { scheduledDate, assignedEmployee, employeeContact, employeeDesignation }
      });
    }

    // Validate phone number format
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(employeeContact.replace(/[- ]/g, ''))) {
      return res.status(400).json({ message: 'Invalid phone number format. Please enter a 10-digit number.' });
    }

    const pickup = await Pickup.findById(pickupId);
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup not found' });
    }

    // Verify dealer is authorized
    if (pickup.dealer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to schedule this pickup' });
    }    // Allow dealer to reschedule if status is not 'completed' or 'cancelled'
    if (['completed', 'cancelled'].includes(pickup.status)) {
      return res.status(400).json({ message: 'Cannot reschedule completed or cancelled pickups' });
    }

    // Validate new schedule date is in the future
    const newScheduleDate = new Date(scheduledDate);
    if (newScheduleDate < new Date()) {
      return res.status(400).json({ message: 'Scheduled date must be in the future' });
    }

    // Add to reschedule history
    pickup.rescheduleHistory.push({ 
      by: 'dealer', 
      date: newScheduleDate, 
      reason: reason || 'Rescheduled by dealer',
      employeeInfo: {
        name: assignedEmployee,
        contact: employeeContact,
        designation: employeeDesignation
      }
    });    // Start transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const oldStatus = pickup.status;
      
      // Update pickup details
      pickup.scheduledDate = new Date(scheduledDate);
      pickup.assignedEmployee = assignedEmployee;
      pickup.employeeContact = employeeContact;
      pickup.employeeDesignation = employeeDesignation;
      if (notes) pickup.notes = notes;
      pickup.status = 'scheduled';

      // Track status change
      if (oldStatus !== 'scheduled') {
        pickup.statusHistory.push({
          from: oldStatus,
          to: 'scheduled',
          by: 'dealer',
          reason: reason || `Pickup ${oldStatus === 'pending' ? 'scheduled' : 'rescheduled'} by dealer`,
          timestamp: new Date()
        });
      }

      await pickup.save({ session });

      // Update car status
      await Car.findByIdAndUpdate(pickup.car, { readyForPickup: true }, { session });

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }

    // Populate for response consistency
    const populatedPickup = await Pickup.findById(pickup._id)
      .populate('car')
      .populate('user')
      .populate('dealer');

    res.json(populatedPickup);
  } catch (err) {
    console.error('Schedule pickup error:', err);
    res.status(500).json({ message: err.message });
  }
};

// User requests reschedule
export const userReschedulePickup = async (req, res) => {
  try {    const { pickupId } = req.params;
    const { newDates, reason } = req.body;

    if (!newDates || !Array.isArray(newDates) || newDates.length === 0) {
      return res.status(400).json({ message: 'Please provide at least one preferred date' });
    }

    const pickup = await Pickup.findById(pickupId);
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup not found' });
    }

    // Verify user is authorized
    if (pickup.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to reschedule this pickup' });
    }

    // Add preferred dates and update status
    pickup.userSuggestedDates = newDates.map(date => new Date(date));
    pickup.rescheduleHistory.push({ 
      by: 'user', 
      date: new Date(newDates[0]), 
      reason: reason || 'Requested by user' 
    });
    pickup.status = 'pending';
    await pickup.save();

    // Populate for response consistency
    const populatedPickup = await Pickup.findById(pickup._id)
      .populate('car')
      .populate('user')
      .populate('dealer');
    res.json(pickup);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get pickups for user
export const getUserPickups = async (req, res) => {
  try {
    const userId = req.user._id;
    const pickups = await Pickup.find({ user: userId }).populate('car dealer');
    res.json(pickups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get pickups for dealer
export const getDealerPickups = async (req, res) => {
  try {
    const dealerId = req.user._id;
    const pickups = await Pickup.find({ dealer: dealerId })
      .populate({
        path: 'car',
        select: 'model year brand images'
      })
      .populate({
        path: 'user',
        select: 'name email phone address'
      })
      .sort({ createdAt: -1 });
    res.json(pickups);
  } catch (err) {
    console.error('Get dealer pickups error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get pickup by ID
export const getPickupById = async (req, res) => {
  try {
    const { pickupId } = req.params;
    const pickup = await Pickup.findById(pickupId).populate('car user dealer');
    if (!pickup) return res.status(404).json({ message: 'Pickup not found' });
    res.json(pickup);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get pickup by carId
export const getPickupByCarId = async (req, res) => {
  try {
    const { carId } = req.params;
    const pickup = await Pickup.findOne({ car: carId })
      .populate('car user dealer');
    if (!pickup) return res.status(404).json({ message: 'Pickup not found for this car' });
    res.json(pickup);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark pickup as completed
export const completePickup = async (req, res) => {
  try {
    const { pickupId } = req.params;
    const { notes } = req.body;

    const pickup = await Pickup.findById(pickupId);
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup not found' });
    }

    // Start a transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update pickup status
      pickup.status = 'completed';
      pickup.notes = notes || pickup.notes;
      pickup.statusHistory.push({
        from: pickup.status,
        to: 'completed',
        by: 'dealer',
        reason: 'Pickup completed by dealer',
        timestamp: new Date()
      });
      
      await pickup.save({ session });

      // Update car status
      await Car.findByIdAndUpdate(pickup.car, 
        { status: 'closed' }, 
        { session }
      );

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }

    // Populate for response
    const populatedPickup = await Pickup.findById(pickupId)
      .populate('car')
      .populate('user')
      .populate('dealer');

    res.json({
      success: true,
      message: 'Pickup marked as completed',
      pickup: populatedPickup
    });

  } catch (err) {
    console.error('Complete pickup error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Check if pickup exists for a car
export const checkPickupExists = async (req, res) => {
  try {
    const { carId } = req.params;
    const existingPickup = await Pickup.findOne({ car: carId });
    return res.status(200).json({ 
        exists: !!existingPickup,
        pickup: existingPickup
    });
  } catch (error) {
    console.error('Error checking pickup existence:', error);
    return res.status(500).json({ message: 'Failed to check pickup status' });
  }
};
