import User from '../models/user.model.js'; 
import jwt from 'jsonwebtoken'; 
import bcrypt from 'bcryptjs';
import Dealer from '../models/dealer.model.js';

// Function to add a new user
const addUser = async (req, res) => {
            console.log(req.body);
            try {
                const user = new User(req.body);
                await user.save();
                res.status(200).json(user);
            } catch (err) {
                console.log(err);
                res.status(500).json(err);
            }
}

// Function to get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

//function to login a user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Include avatar and any other fields you want in the payload
        const { _id, name, email: userEmail, avatar } = user;
        const payload = { _id, name, email: userEmail, avatar };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' },
            (err, token) => {
                if (err) {
                    console.log(err);
                    res.status(500).json(err);
                } else {
                    res.status(200).json({ token, user: payload });
                }
            }
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error', error: err });
    }
};


// Function to upload avatar
const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const userId = req.body.userId; // Assuming userId is sent in the request body
        const avatarUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        const user = await User.findByIdAndUpdate(userId, { avatar: avatarUrl }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Avatar uploaded successfully', user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error', error: err });
    }
};

// Function to update user
const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

// Get all pending dealers (admin only)
const getPendingDealers = async (req, res) => {
    try {
        const pendingDealers = await Dealer.find({ isApproved: false });
        res.status(200).json(pendingDealers);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch pending dealers', error: err });
    }
};

// Approve a dealer (admin only)
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

export { addUser, getAllUsers, login, uploadAvatar, updateUser, getPendingDealers, approveDealer };