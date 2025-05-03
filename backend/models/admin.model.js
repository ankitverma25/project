import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Admin name is required"], 
  },
  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true 
  },
  password: { 
    type: String, 
    required: [true, "Password must be there"] 
  },
  permissions: { 
    type: [String], 
    default: ["approve_dealers", "manage_users"] 
  }, // Admin ke permissions

},{ timestamps: true });

// Password hash karne ka hook
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const Admin= mongoose.model('Admin', adminSchema);

export default Admin;