import Car from "../models/car.model.js";
import cloudinary from '../src/cloudinary.js';

// Function to add a car details

const addCar = async (req, res) => {
    try {
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