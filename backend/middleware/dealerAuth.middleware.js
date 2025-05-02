import jwt from 'jsonwebtoken';
import Dealer from '../models/dealer.model.js';

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

export default dealerAuth;
