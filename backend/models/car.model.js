import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  carModel: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },

  fuelType: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    enum: ["petrol", "diesel", "CNG"],
  },

  manufactureYear: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  carNumber: {
    type: String,
    required: true,
    trim: true,
  },
  carImage: {
    type: Array,
    required: true,
  },
  carDescription: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  kilometersDriven: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  vechicleCondition: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    enum: ["new", "used"],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Car = mongoose.model("Car", carSchema);

export default Car;
