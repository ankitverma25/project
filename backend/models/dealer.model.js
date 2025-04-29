import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const dealerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Dealer ka naam dalna zaroori hai"] 
  },
  email: { 
    type: String, 
    required: [true, "Email dalna zaroori hai"], 
    unique: true 
  },
  password: { 
    type: String, 
    required: [true, "Password dalna zaroori hai"] 
  },
  businessName: { 
    type: String, 
    required: [true, "Business ka naam dalna zaroori hai"] 
  },
  licenseNumber: { 
    type: String, 
    required: [true, "License number dalna zaroori hai"] 
  }, // Business license
  isApproved: { 
    type: Boolean, 
    default: false 
  }, // Admin approve karega tabhi login kar payega
  myBids: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Bid' 
  }], // Dealer ke saare bids
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Password hash karne ka hook (Same as CarOwner)
dealerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const Dealer = mongoose.model('Dealer', dealerSchema);

export default Dealer;