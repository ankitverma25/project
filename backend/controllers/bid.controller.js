import Bid from '../models/bid.model.js';
import Car from '../models/car.model.js';
import Dealer from '../models/dealer.model.js';
import mongoose from 'mongoose';

// Get all bids (for admin or debugging)
const getAllBids = async (req, res) => {
  try {
    const bids = await Bid.find().populate('car').populate('dealer');
    res.status(200).json(bids);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bids', error: err });
  }
};

// Get all bids for a specific car
const getBidsForCar = async (req, res) => {
  try {
    const carId = req.params.carId;
    const bids = await Bid.find({ car: carId }).populate('dealer');
    
    // Map status to isAccepted and isRejected flags for frontend
    const mappedBids = bids.map(bid => ({
      ...bid.toObject(),
      isAccepted: bid.status === 'accepted',
      isRejected: bid.status === 'rejected'
    }));
    
    res.status(200).json(mappedBids);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bids for car', error: err });
  }
};

// Add a new bid (dealer only)
const addBid = async (req, res) => {
  try {
    const { car, amount } = req.body;
    const dealerId = req.dealer._id;
    // Check car exists
    const carDoc = await Car.findById(car);
    if (!carDoc) return res.status(404).json({ message: 'Car not found' });
    
    // Check if car is not closed
    if (carDoc.status === 'closed') {
      return res.status(400).json({ message: 'This car is no longer accepting bids' });
    }
    
    // Create bid
    const bid = new Bid({ car, dealer: dealerId, amount, status: 'pending' });
    await bid.save();
    
    // Add bid to dealer's myBids
    await Dealer.findByIdAndUpdate(dealerId, { $push: { myBids: bid._id } });
    
    res.status(201).json({ success: true, message: 'Bid placed successfully', bid });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to place bid', error: err.message });
  }
};

// Accept a bid (car owner only)
const acceptBid = async (req, res) => {
  try {
    const { bidId } = req.params;
    const { carId } = req.body;

    // Find bid and car
    const bid = await Bid.findById(bidId);
    const car = await Car.findById(carId);

    if (!bid) {
      return res.status(404).json({ success: false, message: 'Bid not found' });
    }
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    // Check if car is already closed
    if (car.status === 'closed') {
      return res.status(400).json({ success: false, message: 'This car already has an accepted bid' });
    }

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update the accepted bid status
      await Bid.findByIdAndUpdate(bidId, 
        { status: 'accepted' }, 
        { session }
      );

      // Update all other bids for this car to rejected
      await Bid.updateMany(
        { car: carId, _id: { $ne: bidId } },
        { status: 'rejected' },
        { session }
      );

      // Close the car for further bidding
      await Car.findByIdAndUpdate(carId, 
        { status: 'closed' },
        { session }
      );

      await session.commitTransaction();
      
      res.status(200).json({
        success: true,
        message: 'Bid accepted successfully'
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (err) {
    console.error('Error accepting bid:', err);
    res.status(500).json({ success: false, message: 'Failed to accept bid' });
  }
};

const getAcceptedBids = async (req, res) => {
  try {
    const userId = req.user._id; // Changed from id to _id

    console.log('Fetching bids for user:', userId);    // Find all accepted bids for the user's cars
    const bids = await Bid.find({ status: 'accepted' })
      .populate({
        path: 'car',
        match: { owner: userId },
        select: '_id model documents documentFormStatus'
      })
      .populate('dealer', '_id name')
      .lean();

    // Filter out bids where car is null (not owned by user)
    const validBids = bids
      .filter(bid => bid.car !== null)
      .map(bid => ({        carId: bid.car._id,
        carName: bid.car.model,
        dealerId: bid.dealer._id,
        dealerName: bid.dealer.name,
        bidAmount: bid.amount,
        documentsStatus: bid.car.documents || {},
        documentsSubmitted: bid.car.documentFormStatus?.isSubmitted || false,
        termsAccepted: bid.car.documentFormStatus?.termsAccepted || false
      }));

    console.log('Found bids:', validBids);
    res.status(200).json(validBids);
  } catch (err) {
    console.error('Error in getAcceptedBids:', err);
    res.status(500).json({ message: 'Error fetching accepted bids', error: err.message });
  }
};

export { getAllBids, getBidsForCar, addBid, acceptBid, getAcceptedBids };