import Dealer from '../models/dealer.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Dealer signup
const dealerSignup = async (req, res) => {
    try {
        const existing = await Dealer.findOne({ email: req.body.email });
        if (existing) {
            return res.status(400).json({ message: 'Dealer with this email already exists' });
        }
        const dealer = new Dealer(req.body);
        await dealer.save();
        res.status(200).json({ message: 'Dealer registered successfully. Wait for admin approval.' });
    } catch (err) {
        res.status(500).json({ message: 'Signup failed', error: err });
    }
};

// Dealer login
const dealerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const dealer = await Dealer.findOne({ email });
        if (!dealer) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, dealer.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (!dealer.isApproved) {
            return res.status(401).json({ message: 'Your account is pending approval' });
        }
        const token = jwt.sign(
            { _id: dealer._id, email: dealer.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.status(200).json({ token, dealer: { ...dealer.toObject(), password: undefined } });
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err });
    }
};

// Get all dealers (for admin)
const getAllDealers = async (req, res) => {
    try {
        const dealers = await Dealer.find().select('-password');
        res.status(200).json(dealers);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch dealers', error: err });
    }
};

// Get pending dealers (for admin)
const getPendingDealers = async (req, res) => {
    try {
        const dealers = await Dealer.find().select('-password');
        res.status(200).json(dealers);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch pending dealers', error: err });
    }
};

// Approve dealer (admin only)
const approveDealer = async (req, res) => {
    try {
        const dealer = await Dealer.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        ).select('-password');
        
        if (!dealer) {
            return res.status(404).json({ message: 'Dealer not found' });
        }
        
        res.status(200).json({ 
            message: 'Dealer approved successfully',
            dealer 
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to approve dealer', error: err });
    }
};

// Reject dealer (admin only)
const rejectDealer = async (req, res) => {
    try {
        const dealer = await Dealer.findByIdAndUpdate(
            req.params.id,
            { isApproved: false },
            { new: true }
        ).select('-password');
        
        if (!dealer) {
            return res.status(404).json({ message: 'Dealer not found' });
        }
        
        res.status(200).json({ 
            message: 'Dealer rejected successfully',
            dealer 
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to reject dealer', error: err });
    }
};

// Get dealer by ID
const getDealerById = async (req, res) => {
    try {
        const dealer = await Dealer.findById(req.params.id).select('-password');
        if (!dealer) {
            return res.status(404).json({ message: 'Dealer not found' });
        }
        res.status(200).json(dealer);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch dealer', error: err });
    }
};

// Delete dealer
const deleteDealer = async (req, res) => {
    try {
        const dealer = await Dealer.findByIdAndDelete(req.params.id);
        
        if (!dealer) {
            return res.status(404).json({ message: 'Dealer not found' });
        }
        
        res.status(200).json({ 
            message: 'Dealer deleted successfully'
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete dealer', error: err });
    }
};

export {
    dealerSignup,
    dealerLogin,
    getAllDealers,
    getPendingDealers,
    approveDealer,
    rejectDealer,
    getDealerById,
    deleteDealer
};
