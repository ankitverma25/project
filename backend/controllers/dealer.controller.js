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
            return res.status(403).json({ message: 'Dealer not approved by admin' });
        }
        const { _id, name, email: dealerEmail, businessName, licenseNumber, isApproved } = dealer;
        const payload = { _id, name, email: dealerEmail, businessName, licenseNumber, isApproved };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' },
            (err, token) => {
                if (err) {
                    res.status(500).json(err);
                } else {
                    res.status(200).json({ token, dealer: payload });
                }
            }
        );
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

// Get all pending dealers
const getPendingDealers = async (req, res) => {
    try {
        const pendingDealers = await Dealer.find({ isApproved: false });
        res.status(200).json(pendingDealers);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch pending dealers', error: err });
    }
};

// Approve a dealer
const approveDealer = async (req, res) => {
    try {
        const dealer = await Dealer.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        );
        if (!dealer) return res.status(404).json({ message: 'Dealer not found' });
        res.status(200).json({ message: 'Dealer approved successfully', dealer });
    } catch (err) {
        res.status(500).json({ message: 'Failed to approve dealer', error: err });
    }
};

export { dealerSignup, dealerLogin, getPendingDealers, approveDealer };
