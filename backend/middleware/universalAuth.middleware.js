import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Dealer from '../models/dealer.model.js';

const universalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Try user
    let user = await User.findById(decoded._id).select('-password');
    if (user) {
      req.user = user;
      return next();
    }
    // Try dealer
    let dealer = await Dealer.findById(decoded._id).select('-password');
    if (dealer) {
      req.dealer = dealer;
      if (!dealer.isApproved) return res.status(403).json({ message: 'Dealer not approved by admin' });
      return next();
    }
    return res.status(401).json({ message: 'Unauthorized' });
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default universalAuth;
