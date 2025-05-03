import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Dealer from '../models/dealer.model.js';

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const dealerAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.dealer = await Dealer.findById(decoded._id).select('-password');
    if (!req.dealer) return res.status(401).json({ message: 'Dealer not found' });
    if (!req.dealer.isApproved) return res.status(403).json({ message: 'Dealer not approved by admin' });
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export { auth, dealerAuth };