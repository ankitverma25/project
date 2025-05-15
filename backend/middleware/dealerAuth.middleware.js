import jwt from 'jsonwebtoken';
import Dealer from '../models/dealer.model.js';

export const dealerAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token belongs to a dealer
    if (decoded.role !== 'dealer') {
      return res.status(401).json({ message: 'Not authorized as dealer' });
    }
    
    const dealer = await Dealer.findById(decoded._id).select('-password');
    
    if (!dealer) return res.status(401).json({ message: 'Dealer not found' });
    if (!dealer.isApproved) return res.status(403).json({ message: 'Dealer not approved by admin' });
    
    // Set both req.dealer and req.user (for compatibility)
    req.dealer = dealer;
    req.user = dealer;
    req.user._id = dealer._id; // Ensure _id is set
    
    next();
  } catch (err) {
    console.error('DealerAuth Error:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
