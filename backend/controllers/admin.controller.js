import Admin from '../models/admin.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Admin signup
const adminSignup = async (req, res) => {
  try {
    const existing = await Admin.findOne({ email: req.body.email });
    if (existing) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }
    // Only pass plain password, let pre-save hook hash it
    const admin = new Admin({ ...req.body });
    await admin.save();
    res.status(200).json({ message: 'Admin registered successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err });
  }
};

// Admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }    const { _id, name, email: adminEmail } = admin;
    const payload = { _id, name, email: adminEmail, isAdmin: true, role: 'admin' };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' },
      (err, token) => {
        if (err) {
          res.status(500).json(err);
        } else {
          res.status(200).json({ token, admin: payload });
        }
      }
    );
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export { adminSignup, adminLogin };
