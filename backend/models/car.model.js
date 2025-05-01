import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // changed from 'CarOwner' to 'User'
    required: [true, "enter the owner"] 
  },
  model: { 
    type: String, 
    required: [true, "required car model"] 
  }, // Ex: "Maruti Swift"

  year: { 
    type: Number, 
    required: [true, "Enter the Manufacturing year"] 
  },
  photos: [{ 
    type: String 
  }], // 3-4 photos URLs (Cloud se)
  description: { 
    type: String, 
    required: [true, "enter the description"] 
  }, // Ex: "Car bahut achi hai, sirf 20,000 km chali hai"
  rcBook: { 
    type: String, 
    required: [true, "enter the RC Book URL"] 
  }, // RC Book PDF URL

  mileage: { 
    type: Number 
  }, // Km mein
  fuelType: { 
    type: String, 
    enum: ["petrol", "diesel", "cng"], 
    required: [true, "enter the fuel type"] 
  }, // Ex: "petrol"


  condition: { 
    type: String, 
    enum: ["excellent", "good", "poor"], 
    default: "good" 
  },
  estimatedValue: { 
    type: Number 
  },
   // AI se calculate hoga
  status: { 
    type: String, 
    enum: ["open", "closed"], 
    default: "open" 
  },// Bidding open/closed
  
  bids: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Bid' 
  }],
},{ timestamps: true });

const Car = mongoose.model("Car", carSchema);

export default Car;
