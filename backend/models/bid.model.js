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
  },  amount: { 
    type: Number, 
    required: [true, "Bid amount dalna zaroori hai"] 
  }, // ₹ mein
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Bid = mongoose.model('Bid', bidSchema);

export default Bid;