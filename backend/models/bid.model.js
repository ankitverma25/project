import mongoose from 'mongoose';


const bidSchema = new mongoose.Schema({
  car: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Car', 
    required: [true, "Car ka ID dalna zaroori hai"] 
  },
  dealer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Dealer', 
    required: [true, "Dealer ka ID dalna zaroori hai"] 
  },
  amount: { 
    type: Number, 
    required: [true, "Bid amount dalna zaroori hai"] 
  }, // ₹ mein
  isAccepted: { 
    type: Boolean, 
    default: false 
  }, // Owner ne accept kiya?
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Bid = mongoose.model('Bid', bidSchema);

export default Bid;