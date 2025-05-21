import mongoose from 'mongoose';

const partSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  partName: {
    type: String,
    required: true,
  },
  carModel: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    enum: ['new', 'used', 'refurbished'],
    default: 'used',
  },
  price: {
    type: Number,
    required: true,
  },
  isNegotiable: {
    type: Boolean,
    default: false,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  images: [{
    type: String,  // URLs to cloudinary images
  }],
  status: {
    type: String,
    enum: ['available', 'sold'],
    default: 'available',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

partSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Part', partSchema);