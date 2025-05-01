import User from '../models/user.model.js'; 
import jwt from 'jsonwebtoken'; 
import bcrypt from 'bcryptjs';




// Function to add a new user
const addUser = async (req, res) => {
            console.log(req.body);
            try {
                const user = new User(req.body);
                await user.save();
                res.status(200).json(user);
            } catch (err) {
                console.log(err);
                res.status(500).json(err);
            }
}

// Function to get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

//function to login a user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const { _id, name, email: userEmail } = user;
        const payload = { _id, name, email: userEmail };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    console.log(err);
                    res.status(500).json(err);
                } else {
                    res.status(200).json({ token, user: payload });
                }
            }
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error', error: err });
    }
};




export {addUser,getAllUsers,login}