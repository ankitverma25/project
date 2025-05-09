import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  url: String,
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  uploadedAt: Date,
  verifiedAt: Date,
  notes: String
});

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

  vehicleNumber: {
    type: String,
    required: [true, "enter the vehicle number"]
  },
  address: {
    fullAddress: { type: String, required: [true, "enter the full address"] },
    state: { type: String, required: [true, "enter the state"] },
    city: { type: String, required: [true, "enter the city"] },
    pincode: { type: String, required: [true, "enter the pincode"] }
  },

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
  
  documents: {
    rc: documentSchema,
    insurance: documentSchema,
    pollution: documentSchema,
    fitness: {
      url: String,
      status: {
        type: String,
        enum: ['pending', 'verified', 'rejected', 'not-required'],
        default: 'not-required'
      },
      uploadedAt: Date,
      verifiedAt: Date,
      notes: String,
      required: Boolean
    }
  },

  bids: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Bid' 
  }],
},{ timestamps: true });

// Add method to check if fitness certificate is required
carSchema.methods.isFitnessRequired = function() {
  const currentYear = new Date().getFullYear();
  return (currentYear - this.year) > 15;
};

// Add pre-save middleware to update fitness certificate requirement
carSchema.pre('save', function(next) {
  if (this.isModified('year')) {
    const fitnessRequired = this.isFitnessRequired();
    this.documents.fitness.required = fitnessRequired;
    this.documents.fitness.status = fitnessRequired ? 'pending' : 'not-required';
  }
  next();
});

const Car = mongoose.model("Car", carSchema);

export default Car;
