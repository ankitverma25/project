import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema=new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "Naam dalna zaroori hai"] 
      },
      email: { 
        type: String, 
        required: [true, "Email dalna zaroori hai"], 
        unique: true 
      },
      password: { 
        type: String, 
        required: [true, "Password dalna zaroori hai"] 
      },      phone: { 
        type: String, 
        required: [true, "Phone number dalna zaroori hai"] 
      },      avatar: { 
        type: String,
        default: '/avatar-placeholder.png'
      }, // Profile photo URL
      myCars: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Car' 
      }]

},{timestamps:true});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });
  


const User=mongoose.model('User',userSchema);

export default User;