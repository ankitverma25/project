import User from '../models/user.model.js'; 
import jwt from 'jsonwebtoken'; 
import bcrypt from 'bcryptjs';
import Dealer from '../models/dealer.model.js';
import cloudinary from "../src/cloudinary.js";
import Car from '../models/car.model.js';

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

// Upload user document (Aadhar/PAN/Address Proof/RC)
const uploadDocument = async (req, res) => {
    try {
        if (!req.files || !req.files.document) {
            return res.status(400).json({ message: 'No document file uploaded' });
        }

        const { documentType } = req.body;
        const validDocTypes = ['aadhar', 'pan', 'address', 'rc', 'insurance', 'pollution'];
        if (!validDocTypes.includes(documentType)) {
            return res.status(400).json({ message: 'Invalid document type' });
        }

        const file = req.files.document[0];

        // Upload document to Cloudinary
        const documentUrl = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: 'auto' },
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result.secure_url);
                }
            );
            stream.end(file.buffer);
        });

        // Get the user and their car
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Initialize documents object if it doesn't exist
        if (!user.documents) user.documents = {};

        // Update document status
        user.documents[documentType] = {
            url: documentUrl,
            status: 'pending',
            uploadedAt: new Date()
        };

        // If it's a car-related document, update car document as well
        if (['rc', 'insurance', 'pollution'].includes(documentType)) {
            const car = await Car.findOne({ owner: user._id });
            if (car) {
                if (!car.documents) car.documents = {};
                car.documents[documentType] = {
                    url: documentUrl,
                    status: 'pending',
                    uploadedAt: new Date()
                };
                // Special handling for RC
                if (documentType === 'rc') {
                    car.rcBook = documentUrl;
                }
                await car.save();
            }
        }

        await user.save();

        res.status(200).json({
            message: 'Document uploaded successfully',
            document: user.documents[documentType]
        });
    } catch (err) {
        console.error('Error uploading document:', err);
        res.status(500).json({ message: 'Failed to upload document', error: err });
    }
};

// Get documents status
const getDocumentsStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get car documents if they exist
        const car = await Car.findOne({ owner: user._id });
        const carDocuments = car ? car.documents : {};
        
        // Combine user and car documents
        const allDocuments = {
            ...user.documents,
            ...carDocuments
        };

        const completionStatus = calculateCompletionStatus(allDocuments);

        res.status(200).json({
            documents: allDocuments,
            completionStatus
        });
    } catch (err) {
        console.error('Error fetching documents:', err);
        res.status(500).json({ message: 'Failed to fetch documents', error: err });
    }
};

// Helper function to calculate document completion status
const calculateCompletionStatus = (documents) => {
    const requiredDocs = ['aadhar', 'pan', 'address', 'rc', 'insurance', 'pollution'];
    const completedDocs = requiredDocs.filter(doc => 
        documents && documents[doc] && documents[doc].status === 'verified'
    );

    return {
        percentage: Math.round((completedDocs.length / requiredDocs.length) * 100),
        completed: completedDocs.length,
        total: requiredDocs.length,
        requiredDocs
    };
};

// Verify user document (admin/dealer only)
const verifyDocument = async (req, res) => {
    try {
        const { userId, documentType, status, notes } = req.body;
        if (!['aadhar', 'pan', 'address'].includes(documentType)) {
            return res.status(400).json({ message: 'Invalid document type' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.documents || !user.documents[documentType]) {
            return res.status(404).json({ message: 'Document not found' });
        }

        user.documents[documentType].status = status;
        user.documents[documentType].verifiedAt = new Date();
        if (notes) user.documents[documentType].notes = notes;

        await user.save();

        res.status(200).json({
            message: 'Document verification status updated',
            document: user.documents[documentType]
        });
    } catch (err) {
        console.error('Error verifying document:', err);
        res.status(500).json({ message: 'Failed to verify document', error: err });
    }
};

export { 
    addUser, 
    getAllUsers, 
    login, 
    uploadAvatar, 
    updateUser, 
    getPendingDealers, 
    approveDealer,
    uploadDocument,
    getDocumentsStatus,
    verifyDocument 
};