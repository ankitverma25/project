import mongoose from 'mongoose';
const { Schema } = mongoose;

const statusChangeSchema = new Schema({
  from: { type: String, enum: ['pending', 'ready-for-pickup', 'scheduled', 'completed', 'cancelled'] },
  to: { type: String, enum: ['pending', 'ready-for-pickup', 'scheduled', 'completed', 'cancelled'] },
  by: { type: String, enum: ['user', 'dealer', 'system'] },
  reason: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const rescheduleSchema = new Schema({
  by: { type: String, enum: ['user', 'dealer'], required: true },
  date: { type: Date, required: true },
  reason: { type: String },
  employeeInfo: {
    name: String,
    contact: String,
    designation: String
  },
  createdAt: { type: Date, default: Date.now }
});

const pickupSchema = new Schema({
  car: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dealer: { type: Schema.Types.ObjectId, ref: 'Dealer', required: true },
  status: { type: String, enum: ['pending', 'ready-for-pickup', 'scheduled', 'completed', 'cancelled'], default: 'pending' },
  scheduledDate: { type: Date },
  assignedEmployee: { type: String },
  employeeContact: { type: String },
  employeeDesignation: { type: String },
  notes: { type: String },
  statusHistory: [statusChangeSchema],
  rescheduleHistory: [rescheduleSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

pickupSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Pickup', pickupSchema);
