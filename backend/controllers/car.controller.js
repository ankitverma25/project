import Car from "../models/car.model.js";



// Function to add a car details

const addCar = async (req, res) => {
    try {
        const car = new Car(req.body);
        await car.save();
        res.status(200).json(car);
        console.log(car);

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
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