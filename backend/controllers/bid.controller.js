import Bid from '../models/bid.model.js';
import Car from '../models/car.model.js';
import Dealer from '../models/dealer.model.js';

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
    res.status(200).json(bids);
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
    // Create bid
    const bid = new Bid({ car, dealer: dealerId, amount });
    await bid.save();
    // Add bid to dealer's myBids
    await Dealer.findByIdAndUpdate(dealerId, { $push: { myBids: bid._id } });
    res.status(201).json({ message: 'Bid placed successfully', bid });
  } catch (err) {
    res.status(500).json({ message: 'Failed to place bid', error: err });
  }
};

export { getAllBids, getBidsForCar, addBid };