import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded._id).select('-password');
    if (!admin) return res.status(401).json({ message: 'Admin not found' });
    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default adminAuth;
