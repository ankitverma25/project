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

export { addCar, getAllCars };