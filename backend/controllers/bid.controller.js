import Bid from '../models/bid.model.js';

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

export { getAllBids, getBidsForCar };