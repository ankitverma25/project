import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { 
    type: String, 
    required: [true, "Phone number dalna zaroori hai"] 
  },
  avatar: { 
    type: String 
  }, // Profile photo URL
  myCars: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Car' 
  }],
  documents: {
    aadhar: documentSchema,
    pan: documentSchema,
    address: documentSchema
  }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;