import Pickup from '../models/pickup.model.js';
import Car from '../models/car.model.js';

// Create a pickup (triggered after all documents are verified)
export const createPickup = async (req, res) => {
  try {
    const { carId, userId, dealerId } = req.body;

    if (!carId || !userId || !dealerId) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: { carId, userId, dealerId },
      });
    }

    // Check if pickup already exists for this car
    const existingPickup = await Pickup.findOne({ car: carId });
    if (existingPickup) {
      return res.status(400).json({ 
        message: 'Pickup already exists for this car',
        pickup: existingPickup
      });
    }    // Check if car exists and documents are verified
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    // Check if all required documents are verified
    const requiredDocs = ['idProof', 'insurance', 'pollution', 'addressProof'];
    const allVerified = requiredDocs.every(docKey => 
      car.documents?.[docKey]?.status === 'verified'
    );
    
    if (!allVerified) {
      return res.status(400).json({ message: 'All car documents must be verified before creating pickup' });
    }

    const pickup = new Pickup({
      car: carId,
      user: userId,
      dealer: dealerId,
      status: 'pending',
    });

    console.log('Creating new pickup:', pickup);
    
    const savedPickup = await pickup.save();
    const populatedPickup = await savedPickup
      .populate('car')
      .populate('user')
      .populate('dealer')
      .execPopulate();

    res.status(201).json(populatedPickup);
  } catch (err) {
    console.error('Create pickup error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Dealer schedules or reschedules a pickup
export const schedulePickup = async (req, res) => {
  try {
    const { pickupId } = req.params;
    const { scheduledDate, assignedEmployee, reason } = req.body;
    const pickup = await Pickup.findById(pickupId);
    if (!pickup) return res.status(404).json({ message: 'Pickup not found' });
    // Add to reschedule history
    if (pickup.scheduledDate) {
      pickup.rescheduleHistory.push({ by: 'dealer', date: scheduledDate, reason });
    }
    pickup.scheduledDate = scheduledDate;
    pickup.assignedEmployee = assignedEmployee;
    pickup.status = 'scheduled';
    await pickup.save();
    res.json(pickup);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// User requests reschedule
export const userReschedulePickup = async (req, res) => {
  try {
    const { pickupId } = req.params;
    const { newDates, reason } = req.body;
    const pickup = await Pickup.findById(pickupId);
    if (!pickup) return res.status(404).json({ message: 'Pickup not found' });
    pickup.userSuggestedDates = newDates;
    pickup.rescheduleHistory.push({ by: 'user', date: newDates[0], reason });
    pickup.status = 'pending';
    await pickup.save();
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
