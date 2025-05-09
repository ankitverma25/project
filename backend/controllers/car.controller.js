import Car from "../models/car.model.js";
import cloudinary from '../src/cloudinary.js';

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
        const fullAddress = addressObj.fullAddress || req.body.fullAddress;
        const state = addressObj.state || req.body.state;
        const city = addressObj.city || req.body.city;
        const pincode = addressObj.pincode || req.body.pincode;
        if (!fullAddress || !state || !city || !pincode) {
            console.error('Missing address fields:', { fullAddress, state, city, pincode, body: req.body });
            return res.status(400).json({ message: 'Full address, state, city, and pincode are required.' });
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
            address: { fullAddress, state, city, pincode }
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

// Function to upload and manage car documents
const uploadDocument = async (req, res) => {
    try {
        if (!req.files || !req.files.document) {
            return res.status(400).json({ message: 'No document file uploaded' });
        }

        const { documentType } = req.body;
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

        // Get the car
        const car = await Car.findOne({ owner: req.user._id });
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        // For RC Book, update both rcBook field and documents.rc
        if (documentType === 'rc') {
            car.rcBook = documentUrl;
            car.documents.rc = {
                url: documentUrl,
                status: 'pending',
                uploadedAt: new Date()
            };
        } else {
            car.documents[documentType] = {
                url: documentUrl,
                status: 'pending',
                uploadedAt: new Date()
            };
        }

        // If it's a fitness certificate, check if it's required
        if (documentType === 'fitness') {
            const isRequired = car.isFitnessRequired();
            if (!isRequired) {
                return res.status(400).json({ 
                    message: 'Fitness certificate is not required for this vehicle' 
                });
            }
        }

        await car.save();

        res.status(200).json({
            message: 'Document uploaded successfully',
            document: car.documents[documentType]
        });
    } catch (err) {
        console.error('Error uploading document:', err);
        res.status(500).json({ message: 'Failed to upload document', error: err });
    }
};

// Upload car document (RC/Insurance/Pollution)
const uploadCarDocument = async (req, res) => {
    try {
        if (!req.files || !req.files.document) {
            return res.status(400).json({ message: 'No document file uploaded' });
        }

        const { carId, documentType } = req.body;
        const validDocTypes = ['rc', 'insurance', 'pollution', 'fitness'];
        if (!validDocTypes.includes(documentType)) {
            return res.status(400).json({ message: 'Invalid document type' });
        }

        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        // Check if user owns the car
        if (car.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to upload documents for this car' });
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

        // Update document status
        if (!car.documents) car.documents = {};
        car.documents[documentType] = {
            url: documentUrl,
            status: 'pending',
            uploadedAt: new Date()
        };

        // Special handling for RC book
        if (documentType === 'rc') {
            car.rcBook = documentUrl;
        }

        await car.save();

        res.status(200).json({
            message: 'Document uploaded successfully',
            document: car.documents[documentType]
        });
    } catch (err) {
        console.error('Error uploading document:', err);
        res.status(500).json({ message: 'Failed to upload document', error: err });
    }
};

// Function to get car documents status
const getDocumentsStatus = async (req, res) => {
    try {
        const car = await Car.findOne({ owner: req.user._id });
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        // Check if fitness certificate is required
        const fitnessRequired = car.isFitnessRequired();

        const completionStatus = calculateCompletionStatus(car.documents, fitnessRequired);
        const canScrap = completionStatus.completed === completionStatus.total && 
                        Object.values(car.documents)
                              .filter(doc => doc.required !== false)
                              .every(doc => doc.status === 'verified');

        res.status(200).json({
            documents: car.documents,
            completionStatus,
            canScrap,
            fitnessRequired
        });
    } catch (err) {
        console.error('Error fetching documents:', err);
        res.status(500).json({ message: 'Failed to fetch documents', error: err });
    }
};

// Get car documents status
const getCarDocuments = async (req, res) => {
    try {
        const { carId } = req.params;
        const car = await Car.findById(carId);
        
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        // Check if user owns the car or is admin/dealer
        if (car.owner.toString() !== req.user._id.toString() && 
            !req.user.isAdmin && !req.user.isDealer) {
            return res.status(403).json({ message: 'Not authorized to view these documents' });
        }

        const documents = car.documents || {};
        const fitnessRequired = car.isFitnessRequired();

        res.status(200).json({
            documents,
            fitnessRequired,
            requirementsMet: checkDocumentRequirements(car)
        });
    } catch (err) {
        console.error('Error fetching documents:', err);
        res.status(500).json({ message: 'Failed to fetch documents', error: err });
    }
};

// Helper function to calculate document completion status
const calculateCompletionStatus = (documents, fitnessRequired) => {
    const requiredDocs = ['rc', 'insurance', 'puc'];
    if (fitnessRequired) requiredDocs.push('fitness');

    const completedDocs = requiredDocs.filter(doc => 
        documents[doc] && documents[doc].status === 'verified'
    );

    return {
        percentage: Math.round((completedDocs.length / requiredDocs.length) * 100),
        completed: completedDocs.length,
        total: requiredDocs.length,
        requiredDocs
    };
};

// Helper function to check if all required documents are verified
const checkDocumentRequirements = (car) => {
    const requiredDocs = ['rc', 'insurance', 'pollution'];
    if (car.isFitnessRequired()) {
        requiredDocs.push('fitness');
    }

    return requiredDocs.every(docType => 
        car.documents && 
        car.documents[docType] &&
        car.documents[docType].status === 'verified'
    );
};

// Function to verify a document (admin/dealer only)
const verifyDocument = async (req, res) => {
    try {
        const { carId, documentType, status, notes } = req.body;

        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        if (!car.documents[documentType]) {
            return res.status(404).json({ message: 'Document not found' });
        }

        car.documents[documentType].status = status;
        car.documents[documentType].verifiedAt = new Date();
        if (notes) car.documents[documentType].notes = notes;

        await car.save();

        res.status(200).json({
            message: 'Document verification status updated',
            document: car.documents[documentType]
        });
    } catch (err) {
        console.error('Error verifying document:', err);
        res.status(500).json({ message: 'Failed to verify document', error: err });
    }
};

// Verify car document (admin/dealer only)
const verifyCarDocument = async (req, res) => {
    try {
        const { carId, documentType, status, notes } = req.body;
        const validDocTypes = ['rc', 'insurance', 'pollution', 'fitness'];
        
        if (!validDocTypes.includes(documentType)) {
            return res.status(400).json({ message: 'Invalid document type' });
        }

        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        if (!car.documents || !car.documents[documentType]) {
            return res.status(404).json({ message: 'Document not found' });
        }

        car.documents[documentType].status = status;
        car.documents[documentType].verifiedAt = new Date();
        if (notes) car.documents[documentType].notes = notes;

        await car.save();

        res.status(200).json({
            message: 'Document verification status updated',
            document: car.documents[documentType]
        });
    } catch (err) {
        console.error('Error verifying document:', err);
        res.status(500).json({ message: 'Failed to verify document', error: err });
    }
};

export { 
    addCar, 
    getAllCars, 
    uploadDocument, 
    getDocumentsStatus, 
    verifyDocument, 
    uploadCarDocument, 
    getCarDocuments, 
    verifyCarDocument 
};