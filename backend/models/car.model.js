import mongoose from "mongoose";

// Document Schema for tracking document status and verification
const documentSchema = new mongoose.Schema({
  url: { type: String },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  uploadedAt: { type: Date },
  verifiedAt: { type: Date },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dealer'
  },
  rejectionMessage: { type: String },
  notes: { type: String }
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
  },  address: {
    state: { type: String, required: [true, "enter the state"] },
    city: { type: String, required: [true, "enter the city"] },
    pincode: { type: String, required: [true, "enter the pincode"] }
  },
  termsAccepted: {
    type: Boolean,
    default: false
  },
  termsAcceptedAt: {
    type: Date
  },
  documents: {
    idProof: documentSchema,
    insurance: documentSchema,
    pollution: documentSchema,
    addressProof: documentSchema
  },  
  
  documentFormStatus: {
    isSubmitted: { 
      type: Boolean, 
      default: false 
    },
    submittedAt: Date,
    lastUpdatedAt: Date,
    termsAccepted: {
      type: Boolean,
      default: false
    },
    termsAcceptedAt: Date
  },  documentStatus: {
    type: String,
    enum: ['pending', 'verifying', 'verified', 'rejected'],
    default: 'pending'
  },

  readyForPickup: {
    type: Boolean,
    default: false
  },
  
  // Added to track if pickup is created
  pickupCreated: {
    type: Boolean,
    default: false
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

  acceptedDealer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dealer'
  },
  
  bids: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Bid' 
  }],
},{ timestamps: true });

const Car = mongoose.model("Car", carSchema);

export default Car;
