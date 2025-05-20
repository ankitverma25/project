import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';

const adminAuth = async (req, res, next) => {
    try {
        // Check if authorization header exists
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'No authorization token provided' });
        }

        // Extract token from Bearer token
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Invalid token format' });
        }

        try {            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check if token is for an admin
            if (!decoded.isAdmin) {
                return res.status(401).json({ message: 'Not authorized as admin' });
            }
            
            // Find admin and exclude password
            const admin = await Admin.findById(decoded._id).select('-password');
            
            if (!admin) {
                return res.status(401).json({ message: 'Admin not found' });
            }

            // Attach admin to request object
            req.admin = admin;
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' });
            }
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid token' });
            }
            throw error;
        }
    } catch (err) {
        console.error('Admin Auth Error:', err);
        res.status(500).json({ message: 'Server error in authentication' });
    }
};

export default adminAuth;
