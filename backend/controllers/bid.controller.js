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
    if (carDoc.status !== 'open') {
      return res.status(400).json({ message: 'Bidding is closed for this car.' });
    }
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

// Accept a bid (owner only)
const acceptBid = async (req, res) => {
  try {
    const bidId = req.params.bidId;
    const bid = await Bid.findById(bidId).populate('dealer').populate('car');
    
    if (!bid) return res.status(404).json({ message: 'Bid not found' });
    if (bid.isAccepted) return res.status(400).json({ message: 'Bid already accepted' });
    
    // Verify car exists and user owns it
    const car = bid.car;
    if (!car) return res.status(404).json({ message: 'Car not found' });
    
    // Check if user is the car owner
    if (car.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized - only car owner can accept bids' });
    }

    // Check if car bidding is still open
    if (car.status !== 'open') {
      return res.status(400).json({ message: 'Bidding is already closed for this car' });
    }

    // Check if any bid for this car is already accepted
    const existingAcceptedBid = await Bid.findOne({ car: car._id, isAccepted: true });
    if (existingAcceptedBid) {
      return res.status(400).json({ message: 'A bid has already been accepted for this car' });
    }

    // Mark bid as accepted
    bid.isAccepted = true;
    await bid.save();

    // Close car for further bidding
    car.status = 'closed';
    await car.save();

    // Update dealer statistics
    const dealer = await Dealer.findById(bid.dealer._id);
    if (!dealer) return res.status(404).json({ message: 'Dealer not found' });

    dealer.totalDeals = (dealer.totalDeals || 0) + 1;
    
    // Calculate response time (in hours)
    const responseTime = (Date.now() - new Date(bid.createdAt).getTime()) / (1000 * 60 * 60);
    
    // Update avgResponseTime with weighted average
    if (!dealer.avgResponseTime || dealer.avgResponseTime === 0) {
      dealer.avgResponseTime = responseTime;
    } else {
      dealer.avgResponseTime = ((dealer.avgResponseTime * (dealer.totalDeals - 1)) + responseTime) / dealer.totalDeals;
    }
    
    await dealer.save();

    // Send success response with details
    res.status(200).json({ 
      message: 'Bid accepted successfully',
      bid,
      car: { id: car._id, status: car.status },
      dealer: { id: dealer._id, totalDeals: dealer.totalDeals }
    });

  } catch (err) {
    console.error('Error accepting bid:', err);
    res.status(500).json({ message: 'Failed to accept bid', error: err.message });
  }
};

export { getAllBids, getBidsForCar, addBid, acceptBid };