import Car from "../models/car.model.js";
import cloudinary from '../src/cloudinary.js';
import fs from 'fs';
import mongoose from 'mongoose';
import events from 'events';

// Create event emitter
export const carEvents = new events.EventEmitter();

// Function to add a car details

const addCar = async (req, res) => {
    try {
        // Debug log to see what is received from frontend
        console.log('REQ.BODY:', req.body);
        console.log('REQ.FILES:', req.files);

        // Upload photos to Cloudinary
        let photoUrls = [];
        if (req.files && req.files.photos) {
            for (const file of req.files.photos) {
                const url = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (err, result) => {
                        if (err) reject(err);
                        else resolve(result.secure_url);
                    });
                    stream.end(file.buffer);
                });
                photoUrls.push(url);
            }
        }
        // Upload rcBook to Cloudinary
        let rcBookUrl = '';
        if (req.files && req.files.rcBook && req.files.rcBook[0]) {
            rcBookUrl = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (err, result) => {
                    if (err) reject(err);
                    else resolve(result.secure_url);
                });
                stream.end(req.files.rcBook[0].buffer);
            });
        }
        // Handle address as object or string
        let addressObj = {};
        if (req.body.address && typeof req.body.address === 'object') {
            addressObj = req.body.address;
        } else if (req.body.address && typeof req.body.address === 'string') {
            try {
                addressObj = JSON.parse(req.body.address);
            } catch {
                addressObj = {};
            }
        }
        const state = addressObj.state || req.body.state;
        const city = addressObj.city || req.body.city;
        const pincode = addressObj.pincode || req.body.pincode;
        if (!state || !city || !pincode) {
            console.error('Missing address fields:', { state, city, pincode, body: req.body });
            return res.status(400).json({ message: 'State, city, and pincode are required.' });
        }
        // Prepare car data
        const carData = {
            owner: req.body.owner,
            model: req.body.model,
            year: req.body.year,
            description: req.body.description,
            rcBook: rcBookUrl,
            fuelType: req.body.fuelType,
            condition: req.body.condition,
            photos: photoUrls,
            mileage: req.body.mileage,
            vehicleNumber: req.body.vehicleNumber,
            address: { state, city, pincode }
        };
        const car = new Car(carData);
        await car.save();
        res.status(200).json(car);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to save car', error: err });
    }
}

// Function to get all cars
const getAllCars = async (req, res) => {
    try {
        const cars = await Car.find().populate("owner", "username email");
        res.status(200).json(cars);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

const uploadDocument = async (req, res) => {
  try {
    const { carId, category } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Verify car ownership and submission status
    const car = await Car.findOne({ _id: carId, owner: req.user._id });
    if (!car) {
      return res.status(404).json({ message: 'Car not found or not owned by user' });
    }

    // Check if documents have already been submitted
    if (car.documentFormStatus?.isSubmitted) {
      return res.status(400).json({ 
        message: 'Documents have already been submitted for this car. Cannot modify documents after submission.' 
      });
    }

    // Upload to cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(file.buffer);
    });

    // Update car document status
    car.documents = car.documents || {};
    car.documents[category] = {
      url: result.secure_url,
      status: 'pending',
      uploadedAt: new Date()
    };

    await car.save();
    res.status(200).json({ message: 'Document uploaded successfully', car });

  } catch (err) {
    console.error('Error uploading document:', err);
    res.status(500).json({ message: 'Failed to upload document', error: err.message });
  }
};

const acceptTerms = async (req, res) => {
  try {
    const { carId } = req.body;

    // Verify car ownership
    const car = await Car.findOne({ _id: carId, owner: req.user._id });
    if (!car) {
      return res.status(404).json({ message: 'Car not found or not owned by user' });
    }

    // Update terms acceptance status
    car.documentFormStatus = car.documentFormStatus || {};
    car.documentFormStatus.termsAccepted = true;
    car.documentFormStatus.termsAcceptedAt = new Date();
    await car.save();

    res.status(200).json({ message: 'Terms accepted successfully', car });
  } catch (err) {
    console.error('Error accepting terms:', err);
    res.status(500).json({ message: 'Failed to accept terms', error: err.message });
  }
};

const submitDocuments = async (req, res) => {
  try {
    const { carId, documents } = req.body;

    // Verify car ownership
    const car = await Car.findOne({ _id: carId, owner: req.user._id });
    if (!car) {
      return res.status(404).json({ message: 'Car not found or not owned by user' });
    }

    // Check if documents are already submitted
    if (car.documentFormStatus?.isSubmitted) {
      return res.status(400).json({ 
        message: 'Documents have already been submitted for this car. Please contact support if you need to make changes.' 
      });
    }    // Check if terms are accepted
    if (!car.documentFormStatus?.termsAccepted) {
      return res.status(400).json({ message: 'Terms must be accepted before submitting documents' });
    }

    // Check if documents are already submitted but in a different status
    if (car.documentStatus === 'verifying') {
      return res.status(400).json({ message: 'Documents are already under verification' });
    }
    if (car.documentStatus === 'verified') {
      return res.status(400).json({ message: 'Documents have already been verified' });
    }

    // Check if all required documents are uploaded
    const requiredDocs = ['idProof', 'insurance', 'pollution', 'addressProof'];
    const missingDocs = requiredDocs.filter(doc => !car.documents?.[doc]?.url);

    if (missingDocs.length > 0) {
      return res.status(400).json({ 
        message: 'Missing required documents', 
        missingDocuments: missingDocs 
      });
    }    // Update submission status
    car.documentFormStatus = car.documentFormStatus || {};
    car.documentFormStatus.isSubmitted = true;
    car.documentFormStatus.submittedAt = new Date();
    car.documentStatus = 'verifying';
    car.documents = documents; // Update with all documents
    await car.save();

    res.status(200).json({ message: 'Documents submitted successfully', car });
  } catch (err) {
    console.error('Error submitting documents:', err);
    res.status(500).json({ message: 'Failed to submit documents', error: err.message });
  }
};

// Get all cars with submitted documents (for dealer verification)
const getSubmittedDocuments = async (req, res) => {
  try {
    // Only cars where documentFormStatus.isSubmitted === true
    const cars = await Car.find({
      'documentFormStatus.isSubmitted': true
    })
      .populate('owner', 'name email')
      .populate({
        path: 'bids',
        populate: { path: 'dealer', select: 'name' }
      });

    // For each car, find the accepted bid (if any)
    const result = cars.map(car => {
      // Find accepted bid
      let acceptedBid = null;
      if (Array.isArray(car.bids)) {
        acceptedBid = car.bids.find(bid => bid.status === 'accepted');
      }
      return {
        _id: car._id,
        model: car.model,
        year: car.year,
        owner: car.owner,
        documents: car.documents,
        documentFormStatus: car.documentFormStatus,
        status: car.status,
        acceptedDealerName: acceptedBid?.dealer?.name || '',
      };
    });
    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching submitted documents:', err);
    res.status(500).json({ message: 'Failed to fetch submitted documents', error: err.message });
  }
};

// Dealer verifies or rejects a document
const verifyDocument = async (req, res) => {
  try {
    const { carId, docKey, status, rejectionMessage } = req.body;
    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    if (!car.documents[docKey]) return res.status(404).json({ message: 'Document not found' });
    car.documents[docKey].status = status;
    if (status === 'verified') {
      car.documents[docKey].verifiedAt = new Date();
      car.documents[docKey].rejectionMessage = undefined;
    } else if (status === 'rejected') {
      car.documents[docKey].rejectionMessage = rejectionMessage || '';
      car.documents[docKey].verifiedAt = undefined;
    }
    await car.save();
    
    // Emit document status update event
    carEvents.emit('document-status-update', {
      carId: car._id,
      documentKey: docKey,
      status,
      car
    });
    
    res.status(200).json({ message: `Document ${status} successfully`, car });
  } catch (err) {
    console.error('Error verifying document:', err);
    res.status(500).json({ message: 'Failed to verify document', error: err.message });
  }
};

export { addCar, getAllCars, uploadDocument, acceptTerms, submitDocuments, getSubmittedDocuments, verifyDocument };